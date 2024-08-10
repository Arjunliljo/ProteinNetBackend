import User from "../Models/userShema.js";
import catchAsync from "../Utilities/catchAsync.js";
import { deleteOne, getAll, getOne } from "./handlerFactory.js";

const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
});
const deleteMe = catchAsync(async (req, res, next) => {});
const updateMe = catchAsync(async (req, res, next) => {});

const getAllUsers = getAll(User);
const getUser = getOne(User);
const deleteUser = deleteOne(User);

const deleteAllUsers = async (req, res, next) => {
  await User.deleteMany({});
  res.status(200).json({ status: "Success", message: "Deleted All Users" });
};

export default { getAllUsers, getUser, deleteUser, deleteAllUsers };
