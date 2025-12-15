/*
  Warnings:

  - A unique constraint covering the columns `[share_token]` on the table `FileUpload` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileUpload_share_token_key" ON "FileUpload"("share_token");
