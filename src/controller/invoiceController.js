import { CreateInvoiceService, InvoiceListService, InvoiceProductListService, PaymentCancelService, PaymentFailService, PaymentIPNService, PaymentSuccessService } from "../services/invoiceServices.js";

export const CreateInvoice = async (req, res) => {
  const result = await CreateInvoiceService(req);
  return res.status(200).json(result);
};

export const PaymentSuccess = async (req, res) => {
  await PaymentSuccessService(req);
  return res.redirect("http://localhost:5173/orders");
};

export const PaymentFail = async (req, res) => {
  await PaymentFailService(req);
  return res.redirect("/orders");
};

export const PaymentCancel = async (req, res) => {
  await PaymentCancelService(req);
  return res.redirect("/orders");
};

export const PaymentIPN = async (req, res) => {
  const result = await PaymentIPNService(req);
  return res.status(200).json(result);
};

export const InvoiceList = async (req, res) => {
  const result = await InvoiceListService(req);
  return res.status(200).json(result);
};

export const InvoiceProductList = async (req, res) => {
  const result = await InvoiceProductListService(req);
  return res.status(200).json(result);
};