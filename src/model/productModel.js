import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    shortDes: {type: String, required: true},
    price: {type: String, required: true},
    star: {type: String, required: true},
    image: {type: String, required: true},
    stock: {type: Boolean, required: true},
    remark: {type: String, required: true},
    category: {type:String, required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductModel = mongoose.model("products", DataSchema);

export default ProductModel;
