import { PrismaClient } from '@prisma/client';



class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {

    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Database.instance;
  }

  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
    }
  }
}

export const prisma = Database.getInstance();
export default Database;

