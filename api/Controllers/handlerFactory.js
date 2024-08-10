import catchAsync from "../Utilities/catchAsync.js";

const getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const datas = await Model.find();
    res.status(200).json({
      status: "Success",
      envelop: {
        datas,
      },
    });
  });
};

const getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await Model.findById(id);
    res.status(200).json({
      status: "Success",
      message: "fetched successfully",
      envelop: {
        data,
      },
    });
  });
};

const createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const createdData = await Model.create(req.body);
    res.status(200).json({
      status: "Success",
      message: "created successfully",
      envelop: {
        data: createdData,
      },
    });
  });
};

const updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const updation = req.body;
    const updatedData = await Model.findByIdAndUpdate(id, updation, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      message: "Successfully Updated",
      envelop: {
        data: updatedData,
      },
    });
  });
};

const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Model.findByIdAndDelete(id);

    res.status(204).json({
      status: "Success",
      message: "Deleted Successfully",
    });
  });
};

export { getAll, getOne, createOne, updateOne, deleteOne };
