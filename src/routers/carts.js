import { Router } from 'express';
import { addProductCart, createCart, deleteCart, deleteProductsInCart, getCartById, updateProductsInCart } from '../controllers/carts.js';

const router = Router();

router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductCart);
router.put('/:cid/products/:pid', updateProductsInCart);
router.delete('/:cid/products/:pid', deleteProductsInCart);
router.delete('/:cid', deleteCart);

export default router;