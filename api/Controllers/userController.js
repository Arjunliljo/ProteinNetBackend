import User from "../Models/userShema.js";
import AppError from "../Utilities/appError.js";
import catchAsync from "../Utilities/catchAsync.js";
import { deleteOne, getAll, getOne } from "./handlerFactory.js";

const getMe = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.userId);
  res.status(200).json({
    status: "Success",
    message: "Successfully fetched the user",
    envelop: {
      me,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError("This is not the route for updating passoword.."));

  const updatedMe = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    message: `${updatedMe.name}'s data updated successfully`,
    envelop: {
      user: updatedMe,
    },
  });
});

const resetPassword = catchAsync(async (req, res, next) => {});

const deleteMe = catchAsync(async (req, res, next) => {});

const getAllUsers = getAll(User);
const getUser = getOne(User);
const deleteUser = deleteOne(User);

const deleteAllUsers = async (req, res, next) => {
  await User.deleteMany({});
  res.status(200).json({ status: "Success", message: "Deleted All Users" });
};

export default {
  getAllUsers,
  getUser,
  deleteUser,
  deleteAllUsers,
  getMe,
  deleteMe,
  updateMe,
  resetPassword,
};
