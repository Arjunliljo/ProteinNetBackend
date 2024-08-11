import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import AppError from "../Utilities/appError.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Must have a Name"],
      maxlength: [20, "User name should be less than 20 characters"],
      minlength: [3, "User name should be greater than 3 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "User must have an Email"],
      maxlength: [20, "Email should be less than 20 characters"],
      minlength: [3, "email should be greater than 3 characters"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "User must have a Phone Number"],
      validate: {
        validator: function (value) {
          return value.length >= 10 && value.length <= 13;
        },
        message:
          "Enter a valid phone number with a length between 9 and 13 digits",
      },
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      minlength: [8, "Password must have atleast 8 characters"],
    },
    confirmPassword: {
      type: String,
      required: [true, "User must have a confirm password"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Password did not matching",
      },
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    changePasswordDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      select: false,
      default: true,
    },
  },
  { timestamps: true }
);

//Encrypting password and checking password and confirm password are correct
userSchema.pre("save", async function (next) {
  console.log("running");
  //check the password is modified or not for when we update
  if (!this.isModified("password")) return next();

  if (this.confirmPassword !== this.password)
    return next(new AppError("Password did not matching...", 401));

  const saltRounds = 10;

  this.password = await bcrypt.hash(this.password, saltRounds);
  this.confirmPassword = undefined;

  next();
});

//checking password for login
userSchema.methods.checkPassword = async function (
  loginPassword,
  hashedPassword
) {
  return await bcrypt.compare(loginPassword, hashedPassword);
};

// deselecting fields that don't want to give to frontend
userSchema.pre(/^find/, async function () {
  this.find({ active: { $ne: false } }).select("-__v");
});

const User = mongoose.model("User", userSchema);

export default User;
