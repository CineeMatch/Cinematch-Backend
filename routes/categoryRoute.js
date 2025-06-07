import express, { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/categories").get(authMiddleware, getAllCategories);
router.route("/category/:id").get(authMiddleware, getCategoryById);
router.route("/category/create").post(authMiddleware, createCategory);
router.route("/category/update/:id").put(authMiddleware, updateCategory);
router.route("/category/delete/:id").delete(authMiddleware, deleteCategory);

export default router; 