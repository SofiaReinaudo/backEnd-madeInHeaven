import { Router } from 'express';
import {homeView, cartIdView, productsView, chatView, realTimeProductsView, loginGet, registerGet, registerPost, logOut, login, addProductView, addProductViewPost} from '../controllers/views.js';
import { admin, auth } from '../middleware/auth.js';
import passport from 'passport';
import { uploader } from '../config/multer.js';
const router = Router();

router.get('/', auth,homeView);
router.get('/realtimeproducts', [auth, admin],  realTimeProductsView);
router.get('/chat', auth, chatView);
router.get('/products', auth, productsView);
router.get('/add-product', auth, addProductView);
router.post('/add-product', [auth, uploader.single('file')], addProductViewPost);
router.get('/cart/:cid', auth, cartIdView);
router.get('/login', loginGet);
router.post('/login', passport.authenticate('login', {failureRedirect:'/login'}),login);
router.get('/register', registerGet);
router.post('/register', passport.authenticate('register', {failureRedirect:'/register'}),registerPost);
router.get('/logout', logOut);
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req,res) => {});
router.get('/login-github-callback', passport.authenticate('github', {failureRedirect:'/register'}), login);

export default router;