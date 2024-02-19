import jwt from "jsonwebtoken";
import { logger } from '../utils/logger.js';

export const generateToken = (user) => {
    try {
        return jwt.sign({...user},process.env.JWT_SECRET_KEY,{expiresIn:'8h'});
    } catch (error) {
        logger.error();
        throw error;
    }
}