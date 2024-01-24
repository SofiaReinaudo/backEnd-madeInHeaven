import { productModel } from "./models/productsModel.js";

export const getProducts = async ({ limit = 10, page = 1, sort, query }) => {
    page = page == 0 ? 1 : page;
    page = Number(page);
    limit = Number(limit)
    const skip = (page - 1) * limit;
    const sortOrderOptions = { 'asc': -1, 'desc': 1 };
    sort = sortOrderOptions[sort] || null;

    try {
        if (query)
            query = JSON.parse(decodeURIComponent(query))
    } catch (error) {
        console.log('Error al parsear', error)
        query = {}
    }

    const queryProducts = productModel.find(query).limit(limit).skip(skip).lean();

    if (sort !== null)
        queryProducts.sort({ price: sort });

    const [productos, totalDocs] = await Promise.all([queryProducts, productModel.countDocuments(query)]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;


    return {
        totalDocs,
        totalPages,
        limit,
        query: JSON.stringify(query),
        page,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        payload: productos,
    }
}

export const getProductById = async (pid) => await productModel.findById(pid);

export const getProductByCode = async (code) => await productModel.findOne({ code });

export const addProduct = async (body) => await productModel.create({ ...body });

export const updateProduct = async (pid, rest) => await productModel.findByIdAndUpdate(pid, { ...rest }, { new: true });

export const deleteProduct = async (pid) => await productModel.findByIdAndDelete(pid);