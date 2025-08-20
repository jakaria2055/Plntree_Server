import {
  createProductServices,
  listByCategoryServices,
  listByKeyWordServices,
  listByRemarkServices,
  readProductServices,
} from "../services/productServices.js";

export const createProduct = async (req, res) => {
  const result = await createProductServices(req);
  return res.status(200).json(result);
};

export const readProduct = async (req, res) => {
  const result = await readProductServices(req);
  return res.status(200).json(result);
};

export const productListByKeyword = async (req, res) => {
  const result = await listByKeyWordServices(req);
  return res.status(200).json(result);
};

export const productListByRemark = async (req, res) => {
  const result = await listByRemarkServices(req);
  return res.status(200).json(result);
};

export const productListByCategory = async (req, res) => {
  const result = await listByCategoryServices(req);
  return res.status(200).json(result);
};
