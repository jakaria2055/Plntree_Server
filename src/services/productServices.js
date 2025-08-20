import ProductModel from "../model/productModel.js";

export const createProductServices = async (req) => {
  try {
    let reqBody = req.body;
    let data = await ProductModel.create(reqBody);

    return {
      status: "success",
      message: "Created Product successfully",
      data: data,
    };
  } catch (error) {
    return { status: "fail", error: error.toString() };
  }
};

export const readProductServices = async (req) => {
  try {
    let data = await ProductModel.find();
    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", error: error.toString() };
  }
};

export const listByKeyWordServices = async (req) => {
  try {
    let SearchRegex = { $regex: req.params.Keyword, $options: "i" };
    let SearchQuery = { $or: [{ title: SearchRegex }, { shortDes: SearchRegex }] };

    let data = await ProductModel.find(SearchQuery).select("-createdAt -updatedAt");

    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const listByRemarkServices = async (req) => {
  try {
    let remark = req.params.Remark;

    let data = await ProductModel.find({ remark })
      .select("-createdAt -updatedAt");

    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

export const listByCategoryServices = async (req) => {
  try {
    let category = req.params.Category;

    let data = await ProductModel.find({ category })
      .select("-createdAt -updatedAt");

    return { status: "success", data };
  } catch (e) {
    return { status: "fail", data: e.message || e.toString() };
  }
};

listByCategoryServices
