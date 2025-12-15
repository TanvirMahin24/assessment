import { FileUpload, Prisma } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { NotFoundError } from '@/utils/errors';

export class FileRepository extends BaseRepository<FileUpload> {
  async findById(id: string): Promise<FileUpload | null> {
    return this.prisma.fileUpload.findUnique({
      where: { id },
    });
  }
  async find(): Promise<any> {
    return this.prisma.fileUpload.findMany();
  }

  async findByShareToken(share_token: string): Promise<FileUpload | null> {
    return this.prisma.fileUpload.findUnique({
      where: { share_token },
    });
  }

  async create(data: Prisma.FileUploadCreateInput): Promise<FileUpload> {
    return this.prisma.fileUpload.create({
      data,
    });
  }
  async createMany(data: Prisma.FileUploadCreateInput[]): Promise<any> {
    return this.prisma.fileUpload.createMany({
      data,
    });
  }

  async update(id: string, data: Prisma.FileUploadUpdateInput): Promise<FileUpload> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('Uploaded file not found');
    }

    return this.prisma.fileUpload.update({
      where: { id },
      data,
    });
  }

  async incrementCount(id: string): Promise<FileUpload> {
    return this.update(id, { download_count: {increment:1} });
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('Uploaded file not found');
    }

    await this.prisma.fileUpload.delete({
      where: { id },
    });
  }
}

