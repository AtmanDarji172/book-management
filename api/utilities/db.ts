import mongoose from 'mongoose';
import { DB_CONFIG } from './config';

/**
 * MongoDB connection using mongoose
 */
export async function connectToDB() {
    try {
        /**
         * Prepare connection string
         */
        const url: string = `mongodb+srv://${DB_CONFIG.USER}:${DB_CONFIG.PASSWORD}@${DB_CONFIG.HOST_NAME}/`;
        await mongoose.connect(url, { dbName: DB_CONFIG.DB_NAME });
    
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error);
    }
}