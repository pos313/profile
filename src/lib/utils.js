import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to a readable string
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Extract file extension from file name
 */
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

/**
 * Check if file is an image
 */
export function isImageFile(file) {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
  return file && validImageTypes.includes(file.type);
}

/**
 * Creates a object URL for a file
 */
export function createFilePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke an object URL to prevent memory leaks
 */
export function revokeFilePreview(preview) {
  if (preview && preview.startsWith('blob:')) {
    URL.revokeObjectURL(preview);
  }
}