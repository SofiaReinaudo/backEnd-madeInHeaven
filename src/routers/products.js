import { Router } from 'express';
import { addProduct, deleteProduct, getProduct, getProductById, updateProduct, mockingProducts } from '../controllers/products.js';
import { uploader } from '../config/multer.js';
import { validarCampos, validarJWT, isAdmin } from '../middleware/auth.js';
import { check } from 'express-validator';
import { existeCode, existeProduct } from '../helpers/db-validaciones.js'

const router = Router();

router.get('/', getProduct);

router.get('/:pid',[
    validarJWT,
    check('pid', 'No es valido el ID del producto').isMongoId(),
    validarCampos,
], getProductById);

router.post('/', [
    validarJWT, 
    isAdmin,
    uploader.single('file')
], addProduct);

router.put('/:pid', [
    validarJWT, 
    isAdmin,
    check('pid', 'No es valido el ID del producto').isMongoId(),
    check('pid').custom(existeProduct),
    validarCampos,
    uploader.single('file')
], updateProduct);

router.delete('/:pid',[
    validarJWT, 
    isAdmin,
    check('pid', 'No es valido el ID del producto').isMongoId(),
    check('pid').custom(existeProduct),
    validarCampos,
], deleteProduct);

router.get('/mocking/products', validarJWT, mockingProducts);

export { router as productsRouter };