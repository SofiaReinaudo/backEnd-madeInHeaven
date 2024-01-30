import { ProductDao } from "../dao/index.js"

export const getProducts = async (query) => await ProductDao.getProducts(query);
export const getProductById = async (pid) => await ProductDao.getProductById(pid);
export const getProductByCode = async (code) => await ProductDao.getProductByCode(code);
export const addProduct = async (body) => await ProductDao.addProduct(body);
export const updateProduct = async (pid, rest) => await ProductDao.updateProduct(pid, rest);
export const deleteProduct = async (pid) => await ProductDao.deleteProduct(pid);