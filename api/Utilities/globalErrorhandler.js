import AppError from "./appError.js";

const sendErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    isOperational: err.isOperational,
    error: err,
    stack: err.stack,
  });
};

const handleInvalidId = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const [value] = err.errmsg.match(/"([^"]*)"/);
  const message = `Duplicate field value ${value} . Please use anothor value`;
  return new AppError(message, 400);
};

const handleValidationDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalide input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

export default function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.isOperational = err.isOperational || false;

  console.log(err.name, err.code);

  //   catchingDuplicateId
  if (err.name === "CastError") err = handleInvalidId(err);

  //Catching duplicate Fields
  if (err.code === 11000) err = handleDuplicateDB(err);

  //handle validationError
  if (err.name === "ValidationError") err = handleValidationDB(err);

  sendErr(err, res);
}
