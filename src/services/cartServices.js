import mongoose from "mongoose";
import CartModel from "../model/cartModel.js";

export const saveCartListService = async (req) => {
  try {
    const userID = req.user._id;
    let reqBody = req.body;
    reqBody.userID = userID;

    await CartModel.create(reqBody);
    return { status: "success", message: "Cart List Create Success" };
  } catch (e) {
    return { status: "fail", message: "Something Went Wrong !" };
  }
};

export const updateCartListService = async (req) => {
  try {
    const userID = req.user._id;
    let cartID = req.params.cartID;
    let reqBody = req.body;

    await CartModel.updateOne(
      { _id: cartID, userID: userID },
      { $set: reqBody }
    );

    return { status: "success", message: "Cart List Update Success" };
  } catch (e) {
    return { status: "fail", message: "Something Went Wrong !" };
  }
};

export const removeCartListService = async (req) => {
  try {
    const userID = req.user._id;
    let reqBody = req.body;
    reqBody.userID = userID;

    await CartModel.deleteOne(reqBody);
    return { status: "success", message: "Cart List Remove Success" };
  } catch (e) {
    return { status: "fail", message: "Something Went Wrong !" };
  }
};

export const cartListService = async (req) => {
  try {
    let userID = new mongoose.Types.ObjectId(req.user._id);

    let matchStage = { $match: { userID: userID } };

    let JoinStageProduct = {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    };
    let unwindProductStage = { $unwind: "$product" };

    let projectionStage = {
      $project: {
        userID: 0,
        createAt: 0,
        updatedAt: 0,
        "product._id": 0,
      },
    };

    let data = await CartModel.aggregate([
      matchStage,
      JoinStageProduct,
      unwindProductStage,
      projectionStage,
    ]);

    return { status: "success", data: data };
  } catch (e) {
    return { status: "fail", message: "Something Went Wrong !" };
  }
};
