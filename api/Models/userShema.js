import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: [8, "Password must have atleast 8 characters"],
  },
  confirmPassword: {
    required: [true, "User must have a confirm password"],
    type: String,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Password did not matching",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["customer", "admin"],
      message: "Role must be a customer admin",
    },
    default: "user",
  },

  changePasswordDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
