import { expect } from "chai";
import supertest from 'supertest';
import { logger } from "../src/utils/logger.js";

const request = supertest('http://http://localhost:8080');

describe('Testing Users', () => {
    // testing login
    describe('Test Post Login', async () => {
        const user = {
            email: 'sofiareinaudo22@gmail.com',
            password:'123456'
        };
        const {statusCode, ok, body } = (await request.post('/api/auth/login')).setEncoding(user);

        logger.info(statusCode);
        logger.info(ok);
        logger.info(JSON.stringify(body));
    });

    // testing registro
    });