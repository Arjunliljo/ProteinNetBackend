import jwt from "jsonwebtoken";

import User from "../Models/userShema.js";
import catchAsync from "../Utilities/catchAsync.js";

const KEY = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, KEY);
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  const token = generateToken(newUser._id);
  res.cookie("jwt", token, { httpOnly: true });

  res.status(201).json({
    status: "Success",
    message: "Successfully signed up",
    token,
    envelop: {
      newUser,
    },
  });
});

export default { signUp };
