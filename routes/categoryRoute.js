import express, { Router } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = Router();

router.route("/categories").get(getAllCategories);
router.route("/categories/:id").get(getCategoryById);
router.route("/categories").post(createCategory);
router.route("/categories/:id").put(updateCategory);
router.route("/categories/:id").delete(deleteCategory);

export default router;
