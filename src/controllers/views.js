import { request, response } from "express";
import { addProductService, getProductByCodeService, getProductsService } from "../services/products.js";
import { getCartByIdService } from "../services/carts.js";
import { validFileExtension } from "../utils/validFileExtension.js";
import { cloudinary } from "../config/cloudinary.js";


export const homeView = async (req = request, res = response) => {
    const limit = 50;
    const {payload} = await getProductsService({limit});
    const user = req.session.user;

    return res.render('home', { payload, styles: 'styles.css', title: 'Home' , user});
}

export const realTimeProductsView = async (req = request, res = response) => {
    const user = req.session.user;
    return res.render('realTimeProducts', { title: 'Real Time', styles: 'styles.css', user });
}

export const chatView = async (req = request, res = response) => {
    const user = req.session.user;
    return res.render('chat', { styles: 'chat.css', title: 'Chat' , user});
}

export const productsView = async (req = request, res = response) => {
    const user = req.session.user;
    const result = await getProductsService({ ...req.query });
    return res.render('products', { title: 'productos', ...result, styles: 'styles.css', user });
}

export const addProductView = async (req = request, res = response) => {
    const user = req.session.user;
    return res.render('addProduct', { title: 'Agregar producto', user })
}

export const addProductViewPost = async (req = request, res = response) => {

    const { title, description, price, code, stock, category } = req.body;

    if (!title, !description, !code, !price, !stock, !category)
        return res.status(404).json({ msg: 'los campos [title,description,code,price,stock,category] son obligatorios' });

    const existeCode = await getProductByCodeService(code);

    if (existeCode)
        return res.status(400).json({ msj: 'El codigo ingresado ya existe en un producto' });

    if (req.file) {

        const isValidExtension = validFileExtension(req.file.originalname);

        if (!isValidExtension)
        return res.status(400).json({ msg: 'La extension del archivo no es valida, [png -jpg -jpeg]' });

        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        req.body.thumbnail = secure_url;
    }

    await addProductService({ ...req.body });

    return res.redirect('/products')
}

export const cartIdView = async (req = request, res = response) => {
    const user = req.session.user;
    const { cid } = req.params;
    const carrito = await getCartByIdService(cid);
    return res.render('cart', {title: 'carrito', carrito, styles:'cart.css', user});
}

export const loginGet = async (req = request, res = response) => {
    if(req.session.user)
        return res.redirect('/')
    return res.render('login', {styles:'login.css'})
}

export const login = async (req = request, res = response) => {
    if(!req.user)
        return res.redirect('/login');
    
    req.session.user = {
        name: req.user.name,
        lastName: req.user.lastName,
        email: req.user.email,
        rol: req.user.rol,
        image: req.user.image
    };

    return res.redirect('/')
}

export const logout = (req = request, res = response) => {
    req.session.destroy(err => {
        if(err)
            return res.send({status: false, body: err})
        else
            return res.redirect('/login')
        
    });
}

export const registerGet = async (req = request, res = response) => {
    if(req.session.user)
        return res.redirect('/')
    return res.render('register', {styles:'login.css'})
}

export const registerPost = async (req = request, res = response) => {
    if(!req.user)
        return res.redirect('/register');
    return res.redirect('/login');
}
