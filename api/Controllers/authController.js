import jwt from "jsonwebtoken";
import User from "../Models/userShema.js";
import catchAsync from "../Utilities/catchAsync.js";
import AppError from "../Utilities/appError.js";

const KEY = "d73675ec1ffe4c4bc4180253618658102712d0329ac696a8312e086af8bc740e";

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
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

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
  //check the token is there or not
  const token = req.cookies.token;
  if (!token) return next(new AppError("Please Login to get access..", 401));

  const decode = jwt.verify(token, KEY); // there is a chance to get error

  // passing the user id to next middleware
  req.userId = decode.id;

  next();
});

export default { signUp, protect, logout, login };
