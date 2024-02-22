import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import { STORAGE } from '../utilities/config';

/**
 * Configure multer for file uploads
 */
const storage = multer.memoryStorage();
export const singleUpload = multer({ storage: storage });

/**
 * Storage config
 */
export const storageClient = new Storage().bucket(STORAGE.BUCKET_NAME);