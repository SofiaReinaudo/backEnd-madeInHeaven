import { Router } from 'express';
import { productModel } from '../models/products.js';

const router = Router();

router.get('/', async (req, res) => {
    const productos = await productModel.find().lean();
    return res.render('home', { productos, styles: 'styles.css', title: 'Home' });
});

router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts', { title: 'Real Time', styles: 'styles.css' });
});

router.get('/chat', (req, res) => {
    return res.render('chat', { styles: 'chat.css', title: 'Chat' });
});

export default router;