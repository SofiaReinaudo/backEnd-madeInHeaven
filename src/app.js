import express from "express";
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import 'dotenv/config';

import products from './routers/products.js';
import carts from './routers/carts.js';
import views from './routers/views.js';
import __dirname from "./utlis.js";
import { dbConnection } from "./database/config.js";
import { messageModel } from "./models/messages.js";
import { getProductsService, addProductService} from "./services/products.js"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);

await dbConnection();

const httpServer = app.listen(PORT, () => {console.log(`Corriendo en el puerto ${PORT}`)});
const io = new Server(httpServer);

io.on('connection', async (socket) => {

    const { payload } = await getProductsService({});
    const productos = payload;

    socket.emit('productos', payload);
    socket.on('agregarProducto', async (producto) => {
        const newProduct = await addProductService({ ...producto })
        if (newProduct) {
            productos.push(newProduct)
            socket.emit('productos', productos)
        }
    });

    const messages = await messageModel.find();
    socket.emit('message', messages);

    socket.on('message', async (data) => {
        const newMessage = await messageModel.create({ ...data });
        if (newMessage) {
            const messages = await messageModel.find();
            io.emit('messageLogs', messages)
        }
    })

    socket.broadcast.emit('nuevo_user');

});
