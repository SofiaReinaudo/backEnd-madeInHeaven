import { request, response } from 'express';
import { addProductService, deleteProductService, getProductByCodeService, getProductByIdService, getProductsService, updateProductService } from '../services/products.js';
import { cloudinary } from '../config/cloudinary.js';
import { validFileExtension } from '../utils/validFileExtension.js';

export const getProducts = async (req = request, res = response) => {
    try {
        const result = await getProductsService({ ...req.query });
        return res.json({ result });
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' });
    }
}

export const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await getProductByIdService(pid);
        if (!producto)
            return res.status(404).json({ msg: `El producto con id ${pid} no existe` });
        return res.json({ producto });
    } catch (error) {
        console.log('getProductById -> ', error);
        return res.status(500).json({ msg: 'Hablar con un administrador' });
    }
}

export const addProduct = async (req = request, res = response) => {
    try {
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

        const producto = await addProductService({ ...req.body });

        return res.json({ producto });

    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' });
    }
}

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const { _id, ...rest } = req.body;

        const product = await getProductByIdService(pid);

        if (!product)
            return res.status(400).json({ msj: `El producto con id ${pid} no existe!` });

        if (req.file) {

            const isValidExtension = validFileExtension(req.file.originalname);

            if (!isValidExtension)
                return res.status(400).json({ msg: 'La extension del archivo no es valida, [png -jpg -jpeg]' });

            if (product.thumbnail) {
                const url = product.thumbnail.split('/');
                const nombre = url[url.length - 1];
                const [id] = nombre.split('.');
                cloudinary.uploader.destroy(id);
            }

            const { secure_url } = await cloudinary.uploader.upload(req.file.path);
            rest.thumbnail = secure_url;

        }

        const producto = await updateProductService(pid, rest);

        if (producto)
            return res.json({ msg: 'Producto Actualizado', producto });
        return res.status(404).json({ msg: `No se pudo actualizar el producto con id ${pid}` });
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' });
    }
}

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await deleteProductService(pid);
        if (producto)
            return res.json({ msg: 'Producto Eliminado', producto });
        return res.status(404).json({ msg: `No se pudo eliminar el producto con id ${pid}` });
    } catch (error) {
        console.log('deleteProduct -> ', error);
        return res.status(500).json({ msg: 'Hablar con un administrador' });
    }
}