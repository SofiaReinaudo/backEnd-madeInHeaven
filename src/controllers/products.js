import { request, response } from 'express';
import { addProductService, deleteProductService, getProductByIdService, getProductsService, updateProductService } from '../services/products.js';

export const getProduct = async (req = request, res = response) => {
    try {
        const result = await getProductsService({ ...req.query });
        return res.json({ result });

    } catch (error) {
        return res.status(500).json({ msg: "Hablar con admin" })
    }
}

export const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await getProductByIdService(pid)
        if (!producto)
            return res.status(404).json({ msg: `El producto con id ${pid} no existe` })
        return res.json({ producto })
    } catch (error) {
        console.log('getProductById ->', error)
        return res.status(500).json({ msg: "Hablar con admin" })
    }
}

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, code, stock, category } = req.body;

        if (!title, !description, !price, !code, !stock, !category)
            return res.status(404).json({ msg: 'Los campos: title, description, price, img, code, stock son obligatorios' })

        const producto = await addProductService({ ...req.body });
        return res.json({ producto })

    } catch (error) {
        return res.status(500).json({ msg: "Hablar con admin" })
    }
}

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const { _id, ...rest } = req.body;
        const producto = await updateProductService(pid, rest);

        if (producto)
            return res.json({ msg: 'Producto actualizado', producto })
        return res.status(404).json({ msg: `No se pudo actualizar el producto con ${pid}` })
    } catch (error) {
        return res.status(500).json({ msg: "Hablar con admin" })
    }
}

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await deleteProductService(pid)
        if (producto)
            return res.json({ msg: 'Producto Eliminado', producto })
        return res.status(404).json({ msg: `No se pudo eliminar el producto con ${pid}` })
    } catch (error) {
        console.log('deleteProduct ->', error)
        return res.status(500).json({ msg: "Hablar con admin" })
    }
}