import { Router } from 'express';
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.js';
import { uploader } from '../config/multer.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', uploader.single('file'), addProduct);
router.put('/:pid', uploader.single('file'), updateProduct);
router.delete('/:pid', deleteProduct)

export default router;