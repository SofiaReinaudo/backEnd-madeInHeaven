import { request, response } from "express";
import { getProductsService } from "../services/products.js";
import { getCartByIdService } from "../services/carts.js";


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
    return res.render('chat', { styles: 'styles.css', title: 'Chat' , user});
}

export const productsView = async (req = request, res = response) => {
    const user = req.session.user;
    const result = await getProductsService({ ...req.query });
    return res.render('products', { title: 'productos', ...result, styles: 'styles.css', user });
}

export const cartIdView = async (req = request, res = response) => {
    const user = req.session.user;
    const { cid } = req.params;
    const carrito = await getCartByIdService(cid);
    return res.render('cart', {title: 'carrito', carrito, styles:'styles.css', user});
}

export const loginGet = async (req = request, res = response) => {
    if(req.session.user)
        return res.redirect('/')
    return res.render('login', {styles:'styles.css'})
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
    return res.render('register', {styles:'styles.css'})
}

export const registerPost = async (req = request, res = response) => {
    if(!req.user)
        return res.redirect('/register');
    return res.redirect('/login');
}
