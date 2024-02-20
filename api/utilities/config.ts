require('dotenv').config();

/**
 * Database configurations
 */
export const DB_CONFIG = {
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB_NAME: process.env.DB_NAME,
    HOST_NAME: process.env.HOST_NAME,
    PORT: process.env.PORT
}