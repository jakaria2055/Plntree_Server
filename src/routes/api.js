import express from "express";
import {
  createProfile,
  loginUser,
  logoutUser,
  readProfile,
  refreshAccessToken,
  registerUser,
  updateProfile,
  verifyUser,
} from "../controller/userController.js";
import { auth } from "../middleware/authenticationMiddleware.js";
import { createProduct, productListByCategory, productListByKeyword, productListByRemark, readProduct } from "../controller/productControllers.js";
import { CartList, RemoveCartList, SaveCartList, UpdateCartList } from "../controller/cartController.js";
import { CreateInvoice, InvoiceList, InvoiceProductList, PaymentCancel, PaymentFail, PaymentIPN, PaymentSuccess } from "../controller/invoiceController.js";


const router = express.Router();

//USER AUTHENTICATION ROUTER
router.post("/user/register", registerUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.post("/user/refresh", refreshAccessToken);
router.post("/user/logout",auth, logoutUser);

// USER PROFILE
router.post("/CreateProfile", auth, createProfile);
router.get("/ReadProfile", auth, readProfile);
router.put("/UpdateProfile",  auth, updateProfile);

//PRODUCT CATEGORY
router.post("/CreateProduct", auth, createProduct);
router.get("/ReadProduct", readProduct);

router.get("/ProductListByKeyword/:Keyword", productListByKeyword);
router.get("/ProductListByRemark/:Remark", productListByRemark);
router.get("/ProductListByCategory/:Category", productListByCategory);

// CART
router.post("/SaveCartList", auth, SaveCartList);
router.post("/UpdateCartList/:cartID", auth, UpdateCartList);
router.post("/RemoveCartList", auth, RemoveCartList);
router.get("/CartList", auth, CartList);

//INVOICE & PAYMENT
router.get("/CreateInvoice", auth, CreateInvoice);
router.get("/InvoiceList", auth, InvoiceList);
router.get("/InvoiceProductList/:invoice_id", auth, InvoiceProductList);

router.post('/PaymentSuccess/:trxID',PaymentSuccess)
router.post('/PaymentCancel/:trxID',PaymentCancel)
router.post('/PaymentFail/:trxID',PaymentFail)
router.post('/PaymentIPN/:trxID',PaymentIPN)


export default router;
