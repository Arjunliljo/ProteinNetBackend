import Product from "../Models/productSchema.js";
import catchAsync from "../Utilities/catchAsync.js";

const getAllProducts = catchAsync(async (req, res, next) => {
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
});

const getProduct = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  res.status(200).json({
    status: "Success",
    message: "Product fetched successfully",
    data: {
      product,
    },
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    status: "Success",
    message: "Product created successfully",
    data: {
      newProduct,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const updation = req.body;

  const product = await Product.findByIdAndUpdate(productId, updation, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    message: "Successfully Updated",
    data: {
      product,
    },
  });
});

export default { getAllProducts, createProduct, updateProduct, getProduct };
