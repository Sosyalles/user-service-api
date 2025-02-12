import { ValidationError } from '../errors/AppError';

export function isValidId(id: any): boolean {
  const parsedId = Number(id);
  return (
    Number.isInteger(parsedId) && 
    parsedId > 0 && 
    parsedId <= Number.MAX_SAFE_INTEGER && 
    String(id).trim() !== ""
  );
}

export function validateId(id: any): number {
  if (!isValidId(id)) {
    throw new ValidationError('Invalid ID: must be a positive integer');
  }
  return id;
} 