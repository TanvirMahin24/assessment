-- CreateTable
CREATE TABLE "FileUpload" (
    "id" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "stored_name" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "share_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "download_count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);
