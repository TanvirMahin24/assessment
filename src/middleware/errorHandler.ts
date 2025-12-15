import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors';
import env from '@/config/env';

export class ErrorHandler {
  public static handle(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
      });
      return;
    }

    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
      const prismaError = err as any;
      if (prismaError.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'A record with this value already exists',
        });
        return;
      }
      if (prismaError.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'Record not found',
        });
        return;
      }
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired',
      });
      return;
    }

    // Handle validation errors
    if (err.name === 'ZodError') {
      res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: (err as any).errors,
      });
      return;
    }

    // Default error
    console.error('Unexpected error:', err);
    res.status(500).json({
      success: false,
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
}

