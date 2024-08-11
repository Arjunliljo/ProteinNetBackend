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
    return next(
      new AppError("This is not the route for updating password..", 400)
    );

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

const resetPassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  console.log(password, newPassword, confirmNewPassword);
  // 1). Check whole nesseccery informations are provided
  if (!newPassword || !password || !confirmNewPassword)
    return next(new AppError(`User must provide valid details..`));

  // 2). Check the given current password matching the old password

  // userId is coming from protect middleware
  const user = await User.findById(req.userId);

  const isPassword = await user.checkPassword(password, user.password);
  if (!isPassword)
    return next(
      new AppError("Invalid password please provide your current password..")
    );

  // 3). check the newPassword and confrimNewPassword are equal or not

  // this will check the password and confirm password matching with mongoose validator
  // also it will trigger the document middle ware in userShema so password will be hashed also
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;

  // 4). reset password
  await user.save();

  res.status(201).json({
    status: "Success",
    message: "Password changed successfully",
    envelop: {
      user,
    },
  });
});

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
