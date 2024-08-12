import Cart from "../Models/cartModel.js";
import Coupon from "../Models/couponsModel.js";
import AppError from "../Utilities/appError.js";
import catchAsync from "../Utilities/catchAsync.js";
import { getAll, getOne, updateOne } from "./handlerFactory.js";

const getMyCart = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findById(req.user.cart);
  if (!myCart)
    return next(
      new AppError("Your are not logged in how did you get this far..?"),
      401
    );

  res.status(200).json({
    status: "Success",
    message: `Successully fetched ${req.user.name}'s cart`,
    myCart,
  });
});

const addProductToMyCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) return next("Please provide the product Id", 400);

  const updatedCart = await Cart.findByIdAndUpdate(
    req.user.cart,
    {
      $addToSet: { products: productId },
    },
    { new: true, runValidators: true }
  );

  if (!updatedCart) return next(new AppError("Cart Not Found", 404));

  const totalPrice = updatedCart.calcTotalPrice(updatedCart.products);
  updatedCart.totalPrice = totalPrice;

  await updatedCart.save();

  res.status(201).json({
    status: "Success",
    message: "Added the product to the cart",
    cart: updatedCart,
  });
});

const removeProductInCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new AppError("Please provide the product ID", 400));
  }

  const updatedCart = await Cart.findByIdAndUpdate(
    req.user.cart,
    { $pull: { products: productId } },
    { new: true }
  );

  if (!updatedCart) {
    return next(new AppError("Cart not found", 404));
  }

  const totalPrice = updatedCart.calcTotalPrice(updatedCart.products);
  updatedCart.totalPrice = totalPrice;

  await updatedCart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart: updatedCart,
    },
  });
});

const applyCoupon = catchAsync(async (req, res, next) => {
  const code = req.body.code;

  if (!code)
    next(new AppError("Must give the code before accessing this route..", 400));

  const coupon = await Coupon.findOne({ code, isValid: true });

  if (!coupon)
    return next(new AppError("Invalide code or Coupon is expired", 404));

  const userCart = await Cart.findById(req.user.cart);

  if (!userCart)
    return next(new AppError("Invalide user please login again..", 401));

  if (!userCart.totalPrice)
    return next(
      new AppError("You Must add some Products to apply coupon", 400)
    );

  if (userCart.isCouponApplied)
    return next(new AppError("Coupon is already assigned", 401));

  const discount = coupon.discountPercent / 100;
  userCart.couponAppliedPrice =
    userCart.totalPrice - userCart.totalPrice * discount;
  userCart.couponAppliedPrice = Math.max(userCart.couponAppliedPrice, 0);

  userCart.isCouponApplied = true;

  await userCart.save();

  res.status(201).json({
    status: "Success",
    discountPercent: coupon.discountPercent,
    couponAppliedPrice: userCart.couponAppliedPrice,
    totalPrice: userCart.totalPrice,
    message: "Successfully assigned the Coupon",
    data: userCart,
  });
});

const removeCoupon = catchAsync(async (req, res, next) => {
  const userCart = await Cart.findById(req.user.cart);

  if (!userCart)
    return next(new AppError("Invalide user please login again..", 401));

  if (!userCart.isCouponApplied)
    return next(new AppError("No coupon is currently applied.", 400));

  userCart.isCouponApplied = false;
  userCart.couponAppliedPrice = false;
  userCart.couponAppliedPrice = undefined;

  await userCart.save();

  res.status(201).json({
    status: "Success",
    message: "Successfully removed the coupon",
    totalPrice: userCart.totalPrice,
    data: userCart,
  });
});

const getAllCart = getAll(Cart);
const getCart = getOne(Cart);
const getCartByEmail = getOne(Cart, "email");

export default {
  getAllCart,
  getCart,
  getMyCart,
  addProductToMyCart,
  removeProductInCart,
  getCartByEmail,
  applyCoupon,
  removeCoupon,
};
