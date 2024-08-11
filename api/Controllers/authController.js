import jwt from "jsonwebtoken";
import User from "../Models/userShema.js";
import catchAsync from "../Utilities/catchAsync.js";
import AppError from "../Utilities/appError.js";
import { otpToPhone } from "../Utilities/otpGenerate.js";
import Cart from "../Models/cartModel.js";

const KEY = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, KEY);
};

const sendToken = (newUser, statusCode, res) => {
  const token = generateToken(newUser._id);
  if (!token) return next(new AppError("Server failed to create token", 500));

  res.cookie("token", token, { httpOnly: true });

  res.status(statusCode).json({
    status: "Success",
    message: "Successfully logged in",
    envelop: {
      newUser,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  // Create the user first
  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    confirmPassword,
  });

  // Create the cart concurrently
  const newUserCart = await Cart.create({
    user: newUser._id,
    products: [],
  });

  // Link the cart to the user in a single save call
  newUser.cart = newUserCart._id;
  await newUser.save({ validateBeforeSave: false });

  // Send the token
  sendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("User must give email and password to login"));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User did not exist..", 404));

  //checking password is matching or not
  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!isPasswordCorrect) return next(new AppError("Incorrect Password.."));

  // restricting password going to frontend
  user.password = undefined;

  sendToken(user, 200, res);
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ status: "Success", message: "Logged out, cookie cleared" });
});

const protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check its there
  const token = req.cookies.token;
  if (!token) return next(new AppError("Please Login to get access..", 401));

  // 2) Varify token
  const decode = jwt.verify(token, KEY); // there is a chance to get error

  // 3) Check the user is still exist to make sure
  const currentUser = await User.findById(decode.id);
  if (!currentUser)
    return next(new AppError("The User belong to this token is not exist"));

  // 4) Check the password is changed after the token is issued
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "The User recently changed password, Please login again",
        401
      )
    );
  }

  // passing the user  to next middleware
  req.user = currentUser;

  next();
});

const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.params;
  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError("Something went wrong user not found...", 400));

  if (Date.now() > user.otpExpires) {
    return next(new AppError("This Otp is expired. Try again..", 401));
  }

  if (user.passwordResetOtp !== otp)
    return next(new AppError("Incorrect OTP check your inbox again...", 400));

  sendToken(user, 200, res);
});

export default { signUp, protect, logout, login, verifyOtp };
