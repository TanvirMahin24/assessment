/*
  Warnings:

  - You are about to alter the column `download_count` on the `FileUpload` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "FileUpload" ALTER COLUMN "download_count" SET DATA TYPE INTEGER;
