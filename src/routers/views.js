import { Router } from 'express';
import {homeView, cartIdView, productsView, chatView, realTimeProductsView, loginGet, registerGet, registerPost, loginPost, logout} from '../controllers/views.js';
import { admin, auth } from '../middleware/auth.js';
const router = Router();

router.get('/', auth,homeView);
router.get('/realtimeproducts', [auth, admin],  realTimeProductsView);
router.get('/chat', auth, chatView);
router.get('/products', auth, productsView);
router.get('/cart/:cid', auth, cartIdView);
router.get('/login', loginGet);
router.post('/login', loginPost);
router.get('/register', registerGet);
router.post('/register', registerPost);
router.get('/logout', logout);

export default router;