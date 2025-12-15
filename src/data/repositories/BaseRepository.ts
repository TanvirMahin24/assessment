import { PrismaClient } from '@prisma/client';
import { prisma } from '@/config/database';

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  abstract findById(id: string): Promise<T | null>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}

