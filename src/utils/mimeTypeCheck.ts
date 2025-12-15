const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const isMimeTypeAllowed = (file: Express.Multer.File) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return true;
  }

  return false;
};
