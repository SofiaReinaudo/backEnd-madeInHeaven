import { Router } from 'express';
import { check } from 'express-validator';
import { crearUsuario, loginUsuario } from '../controllers/auth.js';
import { validarCampos } from '../middleware/auth.js';
import { existeEmail } from '../helpers/db-validaciones.js';

const router = Router();

router.post('/login',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','El email debe ser valido').isEmail(),
    check('password','La password es obligatoria y debe contener al menos 6 caracteres').isLength({min: 6}),
    validarCampos,
], loginUsuario);

router.post('/register',[
    check('name','El campo name es obligatorio').not().isEmpty(),
    check('lastName','El campo LastName es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','El email debe ser valido').isEmail(),
    check('email').custom(existeEmail),
    check('password','La password es obligatoria y debe contener al menos 6 caracteres').isLength({min: 6}),
    validarCampos,
], crearUsuario);

export { router as authRouter}