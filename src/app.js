import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { productsRouter, cartsRouter, authRouter  } from './routers/index.js';

import __dirname from './utils.js';
import { dbConnection } from './database/config.js';

import { addLogger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(addLogger)
app.get('/test', (req, res) => {
    req.logger.debug('debug')
    req.logger.http('http')
    req.logger.info('Info (Info)')
    req.logger.warning('WARNING')
    req.logger.error('Erros')
    req.logger.fatal('Fatal')
    res.send('Todo ok')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

await dbConnection();

app.listen(PORT, () => {console.log(`Corriendo en el puerto ${PORT}`);});



