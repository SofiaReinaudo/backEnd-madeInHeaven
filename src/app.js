import express from "express";
import 'dotenv/config';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import { productsRouter, cartsRouter, authRouter, ticketsRouter } from "./routers/index.js";

import __dirname from "./utils.js";
import { dbConnection } from "./database/config.js";
import { logger } from "./utils/logger.js";
import { requestUrl } from "./middleware/logger.js";
import { Server } from 'socket.io';
import http from 'http';

const app = express();

app.use(cors());
app.use(requestUrl);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 8080;

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de la API Made In Heaven',
            description: 'Made In Heaven - Sofia Reinaudo'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const spec = swaggerJsDoc(swaggerOptions);

// endpoint
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/documentacion-api', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://made-in-heaven.netlify.app'
    }
});

// inicializamos la base de datos
await dbConnection();

io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('mensaje', data => {
        console.log({ data });

        socket.broadcast.emit('mensaje', data);
    })
});


server.listen(PORT, () => { logger.info(`Corriendo aplicacion en el puerto ${PORT}`) });



