import Product from "../Models/productSchema.js";

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      status: "Success",
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "failed", message: "mongoose error" });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json({
      status: "Success",
      message: "Product created successfully",
      data: {
        newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "Failed", message: err.message });
  }
};

const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const updation = req.body;

    const product = await Product.findByIdAndUpdate(productId, updation, {
      new: true,
    });
    console.log(productId);
    res.status(200).json({
      status: "Success",
      message: "Successfully Updated",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "Failed", message: err.message });
  }
};

export default { getAllProducts, createProduct, updateProduct };
