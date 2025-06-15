import { Router } from "express";
import { getAllCoMatchSuggestions, getCoMatchSuggestionById, createCoMatchSuggestion, deleteCoMatchSuggestion } from "../controllers/coMatchSuggestionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/comatchsuggestions").get(authMiddleware, getAllCoMatchSuggestions);
router.route("/comatchsuggestion/:id").get(authMiddleware, getCoMatchSuggestionById);
router.route("/comatchsuggestion/create").post(authMiddleware, createCoMatchSuggestion);
router.route("/comatchsuggestion/delete/:id").delete(authMiddleware, deleteCoMatchSuggestion);

export default router;