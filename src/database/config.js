import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGO_DB,{dbName:process.env.NAME_DB});
        logger.info('Base de datos online');
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}