import env from "@/config/env";
import { asyncHandler } from "@/middleware/asyncHandler";
import { FileService } from "@/services/FileService";
import { NextFunction, Request, Response } from "express";
import moment from "moment";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import fs from "fs";
import { Prisma } from "@prisma/client";
import { isMimeTypeAllowed } from "@/utils/mimeTypeCheck";
const fileUploadSchema = z.object({
  expiryOption: z.enum(["24h", "7d", "30d", "never"]),
});

export class FileUploadController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  upload = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      console.log(req.query);
      const validatedData = fileUploadSchema.parse(req.query);
      //console.log(validatedData.expiryOption)
      const file = req.file;
      if (!file) {
        res.status(400).json({
          message: "No file provided",
        });
        return;
      }

      if (file.size / (1024 * 1024) >= 10) {
        res.status(413).json({
          message: "Payload too large",
        });
        return;
      }

      if (!isMimeTypeAllowed(file)) {
        const filePath = `${path.join(__dirname, "../../uploads")}/${
          file.filename
        }`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error clean up of uploaded file", file);
          }
        });

        res.status(422).json({
          message: "Mimetype not allowed.",
        });
        return;
      }
      const id = uuidv4();

      const days =
        validatedData.expiryOption === "24h"
          ? 1
          : validatedData.expiryOption === "30d"
          ? 30
          : validatedData.expiryOption === "7d"
          ? 7
          : 0;
      var expires_at =
        validatedData.expiryOption === "never"
          ? null
          : moment().add(days, "days").toISOString();
      //console.log(expires_at)

      const result = await this.fileService.upload({
        expires_at,
        mime_type: file?.mimetype || "N/A",
        original_name: file?.originalname || "Unnamed",
        share_token: id,
        stored_name: `${file?.filename}`,
        size: file?.size || 0,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    }
  );
  uploadMany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      console.log(req.query);
      const validatedData = fileUploadSchema.parse(req.query);
      //console.log(validatedData.expiryOption)
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files) {
        res.status(400).json({
          message: "No file provided",
        });
        return;
      }

      const days =
        validatedData.expiryOption === "24h"
          ? 1
          : validatedData.expiryOption === "30d"
          ? 30
          : validatedData.expiryOption === "7d"
          ? 7
          : 0;
      var expires_at =
        validatedData.expiryOption === "never"
          ? null
          : moment().add(days, "days").toISOString();

      const dataToStore: Prisma.FileUploadCreateInput[] = [];

      files.map((fileItem) => {
        // 10 MB check
        if (fileItem.size / (1024 * 1024) >= 10) {
          res.status(413).json({
            message: "Payload too large",
          });
          return;
        }
        const id = uuidv4();

        if (!isMimeTypeAllowed(fileItem)) {
          const filePath = `${path.join(__dirname, "../../uploads")}/${
            fileItem.filename
          }`;
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log("Error clean up of uploaded file", fileItem);
            }
          });
          return;
        }

        dataToStore.push({
          expires_at,
          mime_type: fileItem?.mimetype || "N/A",
          original_name: fileItem?.originalname || "Unnamed",
          share_token: id,
          stored_name: `${fileItem?.filename}`,
          size: fileItem?.size || 0,
        });
      });

      const result = await this.fileService.uploadMany(dataToStore);

      res.status(201).json({
        success: true,
        data: result,
      });
    }
  );

  getFiles = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = await this.fileService.get();

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );
  getFile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.params.id) {
        res.status(404).json({
          success: false,
          message: "File not found",
        });
        return;
      }
      const data = await this.fileService.getOne(req.params.id);

      res.status(200).json({
        success: true,
        data: data,
      });
    }
  );
  deleteFile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.params.id) {
        res.status(404).json({
          success: false,
          message: "File not found",
        });
        return;
      }
      const file = await this.fileService.getOne(req.params.id);
      await this.fileService.deleteOne(req.params.id);

      const filePath = `${path.join(__dirname, "../../uploads")}/${
        file.filename
      }`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error clean up of uploaded file", file);
        }
      });

      res.status(200).json({
        success: true,
      });
    }
  );
  getFileUsingShareToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.params.token) {
        res.status(404).json({
          message: "Invalid token or file not found",
        });
        return;
      }
      const result = await this.fileService.getOneWithShareToken(
        req.params.token
      );

      if (!result) {
        res.status(404).json({
          message: "Invalid token or file not found",
        });
        return;
      }

      if (
        result.expires_at !== null &&
        result.expires_at.getTime() < new Date().getTime()
      ) {
        res.status(410).json({
          message: "Link has expired",
        });
        return;
      }

      const filePath = `${path.join(__dirname, "../../uploads")}/${
        result.stored_name
      }`;

      if (!fs.existsSync(filePath)) {
        res.status(404).send("File not found.");
        return;
      }

      res.setHeader("Content-Type", result.mime_type);
      res.setHeader(
        "Content-Disposition",
        `inline; filename=${result.original_name}`
      );

      const readStream = fs.createReadStream(filePath);

      readStream.on("error", (err) => {
        console.error("File stream error:", err);
        res.status(500).send("Error streaming file.");
      });

      readStream.pipe(res);
    }
  );
}
