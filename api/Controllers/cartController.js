import Cart from "../Models/cartModel.js";
import AppError from "../Utilities/appError.js";
import catchAsync from "../Utilities/catchAsync.js";
import { getAll, getOne, updateOne } from "./handlerFactory.js";

const getMyCart = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findById(req.user.cartId);
  console.log(req.user);
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

const getAllCart = getAll(Cart);
const getCart = getOne(Cart);
const updateCart = updateOne(Cart);

export default { getAllCart, getCart, updateCart, getMyCart };
