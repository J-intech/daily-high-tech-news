import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(err.statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
