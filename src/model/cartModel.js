import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    productID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "products"},
    userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"},
    qty: {type: String, required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CartModel = mongoose.model("carts", DataSchema);

export default CartModel;
