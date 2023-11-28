import { request, response } from 'express';
import { productModel } from '../models/products.js';

export const getProducts = async (req = request, res = response) => {
    try {
        const { limit } = req.query;
        // const productos = await productModel.find().limit(Number(limit));
        // const total = await productModel.countDocuments();
        const [productos, total] = await Promise.all([productModel.find().limit(Number(limit)), productModel.countDocuments()]);
        return res.json({ total, productos });
    } catch (error) {
        console.log('getProducts -> ', error);
        return res.status(500).json({ msg: 'Ocurrió un error.' });
    }
}

export const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await productModel.findById(pid);
        if (!producto)
            return res.status(404).json({ msg: `El producto con id ${pid} no existe` });
        return res.json({ producto });
    } catch (error) {
        console.log('getProductById -> ', error);
        return res.status(500).json({ msg: 'Ocurrió un error.' });
    }
}

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, thumbnails, code, stock, category, status } = req.body;

        if (!title, !description, !code, !price, !stock, !category)
            return res.status(404).json({ msg: 'los campos [title,description,code,price,stock,category] son oblogatorios' });

        const producto = await productModel.create({ title, description, price, thumbnails, code, stock, category, status });

        return res.json({ producto });
    } catch (error) {
        console.log('addProduct -> ', error);
        return res.status(500).json({ msg: 'Ocurrió un error.' });
    }
}

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const { _id, ...rest } = req.body;
        const producto = await productModel.findByIdAndUpdate(pid, { ...rest }, { new: true });

        if (producto)
            return res.json({ msg: 'Producto Actualizado', producto });
        return res.status(404).json({ msg: `No se pudo actualizar el producto con id ${pid}` });
    } catch (error) {
        console.log('deleteProduct -> ', error);
        return res.status(500).json({ msg: 'Ocurrió un error.' });
    }
}

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await productModel.findByIdAndDelete(pid);
        if (producto)
            return res.json({ msg: 'Producto Eliminado', producto });
        return res.status(404).json({ msg: `No se pudo eliminar el producto con id ${pid}` });
    } catch (error) {
        console.log('deleteProduct -> ', error);
        return res.status(500).json({ msg: 'Ocurrió un error.' });
    }
}