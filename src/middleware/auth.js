import { request, response } from "express";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const isAdmin = (req = request, res = response, next) => {
    if (!(req.rol === 'admin'))
        return res.status(403).json({ok:false, msg:'Permisos insuficientes'}); 
    next();
};

export const validarCampos = (req = request, res = response, next) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json(errores);
    }
    next();
};

export const validarJWT = (req = request, res = response, next) => {
    
    //const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.header('x-token');
    
    if(!token)
        return res.status(401).json({ok:false, msg:'No hay token en la peticion'});

    try {
        const {_id, email, rol, name, lastName} = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req._id = _id;
        req.email = email;
        req.rol = rol;
        req.name = name;
        req.lastName = lastName;
    } catch (error) {
        console.log(error);
        return res.status(401).json({ok:false, msg:'Token no valido'});
    }
    next();
}