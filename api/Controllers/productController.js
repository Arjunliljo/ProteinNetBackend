import Product from "../Models/productSchema.js";
import { createOne, getAll, getOne, updateOne } from "./handlerFactory.js";

const getAllProducts = getAll(Product);

const getProduct = getOne(Product);

const createProduct = createOne(Product);

const updateProduct = updateOne(Product);

export default { getAllProducts, createProduct, updateProduct, getProduct };
