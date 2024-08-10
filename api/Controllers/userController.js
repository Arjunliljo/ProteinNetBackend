import User from "../Models/userShema.js";
import { createOne, getAll, getOne, updateOne } from "./handlerFactory.js";

const getAllUsers = getAll(User);
const getUser = getOne(User);
const updateUser = updateOne(User);
