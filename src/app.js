import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { productsRouter, cartsRouter, authRouter  } from './routers/index.js';

import __dirname from './utils.js';
import { dbConnection } from './database/config.js';

import { logger } from './utils/logger.js';
import { requestUrl } from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(requestUrl);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

await dbConnection();

app.listen(PORT, () => {logger.info(`Corriendo en el puerto ${PORT}`);});



