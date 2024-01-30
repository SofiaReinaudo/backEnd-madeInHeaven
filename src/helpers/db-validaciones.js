import { CartsRepository, ProductsRepository, UsersRepository } from "../repositories/index.js";

export const existeEmail = async (email) => {
    const emailExiste = await UsersRepository.getUserByEmail(email);
    if (emailExiste)
        throw new Error(`El email ${email} ya esta registrado.`);
}

export const existeCode = async (code) => {
    const codeExiste = await ProductsRepository.getProductByCode(code);
    if (codeExiste)
        throw new Error(`El code ${code} ya esta registrado otro producto.`);
}

export const existeProduct = async (idProduct) => {
    const productExiste = await ProductsRepository.getProductById(idProduct);
    if (!productExiste)
        throw new Error(`El id ${idProduct} del producto no existe.`);
}

export const existeCart = async (idCart) => {
    const cartExiste = await CartsRepository.getCartById(idCart);
    if (!cartExiste)
        throw new Error(`El id ${idCart} del carrito no existe.`);
}