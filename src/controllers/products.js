import { request, response } from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { validFileExtension } from '../utils/validFileExtension.js';
import { ProductsRepository } from "../repositories/index.js";
import { faker } from '@faker-js/faker';

export const getProduct = async (req = request, res = response) => {
    try {
        const result = await ProductsRepository.getProducts({ ...req.query });
        return res.json({ result });
    } catch (error) {
        return res.status(500).json({ msg: "Hablar con un administrador" })
    }
};

export const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await ProductsRepository.getProductById(pid)
        if (!producto)
            return res.status(404).json({ msg: `El producto con id ${pid} no existe` })
        return res.json({ producto })
    } catch (error) {
        console.log('getProductById ->', error)
        return res.status(500).json({ msg: "Hablar con un administrador" })
    }
};

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, code, stock, category } = req.body;

        if(!title || !description || !price || !code || !stock || !category) return res.status(400).json({ msj: 'Datos incompletos title, description, price, code, stock, category' })

        if (req.file) {

            const isValidExtension = validFileExtension(req.file.originalname);

            if (!isValidExtension)
                return res.status(400).json({ msg: 'La extension no es valida' });

            const { secure_url } = await cloudinary.uploader.upload(req.file.path);
            req.body.thumbnails = secure_url;
        }

        const producto = await ProductsRepository.addProduct({ ...req.body });
        return res.json({ producto })

    } catch (error) {
        return res.status(500).json({ msg: "Hablar con administrador." })
    }
};

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const { _id, ...rest } = req.body;

        const product = await ProductsRepository.getProductById(pid);

        if (!product)
            return res.status(404).json({ msg: `El producto con Id ${pid} no existe!` })

        if (req.file) {

            const isValidExtension = validFileExtension(req.file.originalname);

            if (!isValidExtension)
                return res.status(400).json({ msg: 'La extension no es valida' });

            if (product.thumbnails) {
                const url = product.thumbnails.split('/');
                const nombre = url[url.length - 1];
                const [id] = nombre.split('.');
                cloudinary.uploader.destroy(id);
            }

            const { secure_url } = await cloudinary.uploader.upload(req.file.path);
            rest.thumbnails = secure_url;
        };

        const producto = await ProductsRepository.updateProduct(pid, rest);

        if (producto)
            return res.json({ msg: 'Producto actualizado', producto })
        return res.status(404).json({ msg: `No se pudo actualizar el producto con ${pid}` })
    } catch (error) {
        return res.status(500).json({ msg: "Hablar con un administrador" })
    }
};

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        
        const producto = await ProductsRepository.deleteProduct(pid)
        cloudinary.uploader.destroy(pid);

        if (producto)
            return res.json({ msg: 'Producto Eliminado', producto })
        return res.status(404).json({ msg: `No se pudo eliminar el producto con ${pid}` })
    } catch (error) {
        console.log('deleteProduct ->', error)
        return res.status(500).json({ msg: "Hablar con un administrador" })
    }
};

export const mockingProducts = async (req = request, res = response) => {
    try {
        faker.location = 'es';
        const products = Array.from({length:100},(_, index) => ({
            _id:faker.string.uuid(),
            title:faker.commerce.productName(),
            description: faker.lorem.sentence(),
            code: (index + 1).toString(),
            price: faker.number.int({min:1, max:100}),
            status: faker.datatype.boolean(),
            stock: faker.number.int({min:1, max:100}),
            category: faker.commerce.department(),
            thumbnail: faker.image.url(),
        }));

        return res.json({products});
    } catch (error) {
        console.log('mockingProducts ->', error)
        return res.status(500).json({ msg: "Hablar con administrador." })
    }
};