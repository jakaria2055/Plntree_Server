import {
  cartListService,
  removeCartListService,
  saveCartListService,
  updateCartListService,
} from "../services/cartServices.js";

export const SaveCartList = async (req, res) => {
  let result = await saveCartListService(req);
  return res.status(200).json(result);
};

export const UpdateCartList = async (req, res) => {
  let result = await updateCartListService(req);
  return res.status(200).json(result);
};

export const RemoveCartList = async (req, res) => {
  let result = await removeCartListService(req);
  return res.status(200).json(result);
};

export const CartList = async (req, res) => {
  let result = await cartListService(req);
  return res.status(200).json(result);
};
