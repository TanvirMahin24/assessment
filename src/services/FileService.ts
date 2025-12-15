import { FileRepository } from "@/data/repositories/FileRepository";
import { FileUpload, Prisma } from "@prisma/client";
import { CacheService } from "./CacheService";

export class FileService {
  private fileRepository: FileRepository;
  private cacheService: CacheService;

  constructor() {
    this.fileRepository = new FileRepository();
    this.cacheService = new CacheService();
  }

  async upload(data: Prisma.FileUploadCreateInput): Promise<any> {
    const result = await this.fileRepository.create(data);
    await this.cacheService.delete("files");
    return {
      data: result, // To be returned created obj
    };
  }
  async uploadMany(data: Prisma.FileUploadCreateInput[]): Promise<any> {
    const result = await this.fileRepository.createMany(data);
   await this.cacheService.delete("files");
    return {
      data: result, // To be returned created obj
    };
  }
  async get(): Promise<any> {
    const cachedResult = await this.cacheService.get("files");
    if (cachedResult) {
      return {
        data: JSON.parse(cachedResult as string), // To be returned created obj
      };
    }
    const result = await this.fileRepository.find();

    this.cacheService.set("files", JSON.stringify(result));
    return {
      data: result, // To be returned created obj
    };
  }
  async getOne(id: string): Promise<any> {
    const result = await this.fileRepository.findById(id);
    return {
      data: result, // To be returned created obj
    };
  }
  async deleteOne(id: string): Promise<void> {
    await this.fileRepository.delete(id);
    await this.cacheService.delete("files");
    return;
  }
  async getOneWithShareToken(token: string): Promise<FileUpload | null> {
    const result = await this.fileRepository.findByShareToken(token);
    return result; // To be returned created obj
  }
}
