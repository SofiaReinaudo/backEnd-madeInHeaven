import express from "express";
import 'dotenv/config';

import { productsRouter, cartsRouter, authRouter} from "./routers/index.js";

import __dirname from "./utlis.js";
import { dbConnection } from "./database/config.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

await dbConnection();

app.listen(PORT, () => {console.log(`Corriendo en el puerto ${PORT}`)});



