import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from '../errors/AppError';

// Define file type for TypeScript
interface MulterFile extends Express.Multer.File {
  mimetype: string;
  originalname: string;
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: MulterFile, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/profiles');
  },
  filename: (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPG, PNG and GIF files are allowed', 400));
  }
};

// Export multer configuration
export const uploadConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for multiple profile photos
export const uploadProfilePhotos = uploadConfig.array('photos', 5); // Max 5 photos 