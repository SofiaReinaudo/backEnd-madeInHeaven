import { response, request } from 'express';
import { CartsRepository, UsersRepository } from '../repositories/index.js';
import { createHash, isValidPassword } from '../utils/bcryptPassword.js';
import { generateToken } from '../utils/jsonWebToken.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../helpers/send-email.js';
import jwt from 'jsonwebtoken';

export const loginUsuario = async(req=request, res=response) => {
    try {
        const {email, password} = req.body;

        const usuario = await UsersRepository.getUserByEmail(email);
        if(!usuario) return res.status(400).json({ok:false, msg: 'Datos incorrectos.'});

        const validPassword = isValidPassword(password, usuario.password);
        if(!validPassword) return res.status(400).json({ok:false, msg: 'Datos incorrectos'});

        const {_id, name, lastName, rol} = usuario;
        const token = generateToken({_id, name, lastName, email, rol});

        return res.json({ok:true, usuario, token})

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ok:false, msg: 'Por favor, contactacte a un administrador.'});
    }
};

export const crearUsuario = async(req=request, res=response) => {
    try {
        req.body.password = createHash(req.body.password);
        
        const carrito = await CartsRepository.createCart();
        if(!carrito) return res.status(500).json({ok: false, msg: 'No se pudo crear el carrito'})

        req.body.cart_id = carrito._id;

        const usuario = await UsersRepository.registerUser(req.body);

        const {_id, name, lastName, email, rol} = usuario;
        const token = generateToken({_id, name, lastName, email, rol});

        return res.json({ok:true, usuario, token});
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ok:false, msg: 'Por favor, contactarse con un admin'})
    }
};

export const revalidarToken = async(req=request, res=response) => {
    
    const {_id, name, lastName, email, rol} = req;

    const usuario = await UsersRepository.getUserByEmail(email);

    const token = generateToken({_id, name, lastName, email, rol});

    return res.json({ok:true, usuario, token});
}

export const cambiarPassword = async(req=request, res=response) => {
    const { email } = req.body;
    const usuario = await UsersRepository.getUserByEmail(email);
    if(!usuario) return res.status(400).json({ok:false, msg:'Usuario invalido'});

    const token = generateToken({email}, '1h');

    const urlReset = `${process.env.URL_RESET_PASS}?token=${token}`;

    sendEmail(email, urlReset);

    return res.json({ok:true, msg:'Email enviado'});
};

export const validarTokenPassword = async(req=request, res=response) => {
    try {
        const {token} = req.query;
        const {email} = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return res.json({ok:true, token, email});
    } catch (error) {
        logger.error(error);
        return res.status(401).json({ok:false, msg:'Token invalido'});
    }
};

export const resetPassword = async(req=request, res=response) => {
    try {
        const {token, password} = req.body;
        const {email} = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const usuario = await UsersRepository.getUserByEmail(email);
        if(!usuario) return res.status(400).json({ok:false, msg: 'Email invalido.'});

        const validPassword = isValidPassword(password, usuario.password);
        if(validPassword) return res.status(400).json({ok:false, msg: 'La contraseña debe ser diferente a la anterior.'});

        usuario.password = createHash(password);
        usuario.save();

        return res.json({ok:true, msg: 'Se cambió correctamente la contraseña.'})

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ok:false, msg:'Hablar con un administrador.'});
    }
};