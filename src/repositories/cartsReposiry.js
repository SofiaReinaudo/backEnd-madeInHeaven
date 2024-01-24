import {CartDao} from "../dao/index.js";

export const getCartById = async (cid) => await CartDao.getCartById(cid);
export const createCart = async () => await CartDao.createCart();
export const addProductCart = async (cid, pid) => await CartDao.addProductCart(cid, pid);
export const deleteProductsInCart = async (cid, pid) => await CartDao.deleteProductsInCart(cid, pid);
export const updateProductsInCart = async (cid, pid, quantity) => await CartDao.updateProductsInCart(cid, pid, quantity);
export const deleteCart = async (cid) => await CartDao.deleteCart(cid);