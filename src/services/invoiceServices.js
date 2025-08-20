import mongoose from "mongoose";
import CartModel from "../model/cartModel.js";
import ProfileModel from "../model/profileModel..js";
import InvoiceProductModel from "../model/invoiceProductModel.js";
import PaymentSettingModel from "../model/paymentSettingsModel.js";
import InvoiceModel from "../model/invoiceModel.js";
import axios from "axios";

const ObjectID = mongoose.Types.ObjectId;

export const CreateInvoiceService = async (req) => {
  const userID = new ObjectID(req.user._id);
  const cus_email = req.user?.email;

  //CALCULATE VAT & TOTAL
  const CartProduct = await CartModel.aggregate([
    { $match: { userID: userID } },
    {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);

  let totalAmount = 0;
  CartProduct.forEach((element) => {
    const price = element.product.price;
    totalAmount = totalAmount + parseFloat(element.qty) * price;
  });

  const vat = totalAmount * 0.05;
  const payable = totalAmount + vat;

  //CUSTOMER AND SHIPPING DETAILS
  const profile = await ProfileModel.aggregate([
    { $match: { userID: userID } },
  ]);

  const cusDetails = `Name: ${profile[0]?.cus_name}, Email: ${cus_email}, Address: ${profile[0]?.cus_add}, Phone: ${profile[0]?.cus_phone}`;

  const shipDetails = `Name: ${profile[0].ship_name}, City: ${profile[0].ship_city}, Address: ${profile[0].ship_add}, Phone: ${profile[0].ship_phone}`;

  //TRANSACTION DETAILS
  const tran_id = Math.floor(10000000 + Math.random() * 90000000);
  const val_id = 0;
  const delivery_status = "Pending...";
  const payment_status = "Pending";

  //INVOICE
  const createInvoice = await InvoiceModel.create({
    userID: userID,
    payable,
    cus_details: cusDetails,
    ship_details: shipDetails,
    tran_id,
    val_id,
    payment_status,
    delivery_status,
    total: totalAmount,
    vat,
  });

  //CREATE INVOICE PRODUCT
  const invoice_id = createInvoice._id;
  CartProduct.forEach(async (element) => {
    await InvoiceProductModel.create({
      userID: userID,
      productID: element.productID,
      invoiceID: invoice_id,
      qty: element.qty,
      price: element.product.price,
    });
  });

  //CLEAR CART AFTER INVOICE CREATION
  await CartModel.deleteMany({ userID: userID });

  //PREAPARE SSL PAYMENT
  const PaymentSettings = await PaymentSettingModel.find();
  console.log(PaymentSettings);

  const form = new FormData();
  form.append("store_id", PaymentSettings[0].store_id);
  form.append("store_passwd", PaymentSettings[0].store_passwd);
  form.append("total_amount", payable.toString());
  form.append("currency", PaymentSettings[0].currency);
  form.append("tran_id", tran_id);

  form.append("success_url", `${PaymentSettings[0].success_url}/${tran_id}`);
  form.append("fail_url", `${PaymentSettings[0].fail_url}/${tran_id}`);
  form.append("cancel_url", `${PaymentSettings[0].cancel_url}/${tran_id}`);
  form.append("ipn_url", `${PaymentSettings[0].ipn_url}/${tran_id}`);

  form.append("cus_name", profile[0].cus_name);
  form.append("cus_email", cus_email);
  form.append("cus_add1", profile[0].cus_add);
  form.append("cus_add2", profile[0].cus_add);
  form.append("cus_city", profile[0].cus_city);
  form.append("cus_state", profile[0].cus_state);
  form.append("cus_postcode", profile[0].cus_postcode);
  form.append("cus_country", profile[0].cus_country);
  form.append("cus_phone", profile[0].cus_phone);
  form.append("cus_fax", profile[0].cus_phone);

  form.append("shipping_method", "YES");
  form.append("ship_name", profile[0].ship_name);
  form.append("ship_add1", profile[0].ship_add);
  form.append("ship_add2", profile[0].ship_add);
  form.append("ship_city", profile[0].ship_city);
  form.append("ship_state", profile[0].ship_state);
  form.append("ship_country", profile[0].ship_country);
  form.append("ship_postcode", profile[0].ship_postcode);

  form.append("product_name", "According Invoice");
  form.append("product_category", "According Invoice");
  form.append("product_profile", "According Invoice");
  form.append("product_amount", "According Invoice");

  const SSLRes = await axios.post(PaymentSettings[0].init_url, form);
  return { status: "success", data: SSLRes.data };
};

export const PaymentSuccessService = async (req) => {
  try {
    const trxID = req.params.trxID;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: "success" }
    );
    return { status: "success" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const PaymentFailService = async (req) => {
  try {
    const trxID = req.params.trxID;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: "fail" }
    );
    return { status: "fail" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const PaymentCancelService = async (req) => {
  try {
    const trxID = req.params.trxID;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: "cancel" }
    );
    return { status: "cancel" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const PaymentIPNService = async (req) => {
  try {
    const trxID = req.params.trxID;
    const status = req.body.status;
    await InvoiceModel.updateOne(
      { tran_id: trxID },
      { payment_status: status }
    );
    return { status: "success" };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const InvoiceListService = async (req) => {
  try {
    const userID = req.user._id;
    const invoice = await InvoiceModel.find({ userID: userID });
    return { status: "success", data: invoice };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};

export const InvoiceProductListService = async (req) => {
  try {
    const userID = new ObjectID(req.user._id);
    const invoice_id = new ObjectID(req.params.invoice_id);

    console.log("userID:", userID);
    console.log("invoiceID:", invoice_id);

    const products = await InvoiceProductModel.aggregate([
      { $match: { userID: userID, invoiceID: invoice_id } },
      {
        $lookup: {
          from: "products",
          localField: "productID",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    console.log(products);
    return { status: "success", data: products };
  } catch {
    return { status: "fail", message: "Something Went Wrong" };
  }
};
