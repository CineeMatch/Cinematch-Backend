import express, { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = Router();

router.route("/categories").get(getAllCategories);
router.route("/category/:id").get(getCategoryById);
router.route("/category/create").post(createCategory);
router.route("/category/update/:id").put(updateCategory);
router.route("/category/delete/:id").delete(deleteCategory);

export default router; 