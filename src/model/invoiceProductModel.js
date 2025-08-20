import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    productID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "products"},
    userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"},
    invoiceID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "invoices"},
    qty: {type: String, required: true},
    color: {type: String, required: true},
    size: {type: String, required: true}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const InvoiceProductModel = mongoose.model("invoicesproducts", DataSchema);

export default InvoiceProductModel;
