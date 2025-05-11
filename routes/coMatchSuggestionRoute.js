import { Router } from "express";
import { getAllCoMatchSuggestions, getCoMatchSuggestionById, createCoMatchSuggestion, updateCoMatchSuggestion, deleteCoMatchSuggestion } from "../controllers/coMatchSuggestionController.js";

const router = Router();

router.route("/comatchsuggestions").get(getAllCoMatchSuggestions);
router.route("/comatchsuggestions/:id").get(getCoMatchSuggestionById);
router.route("/comatchsuggestions").post(createCoMatchSuggestion);
router.route("/comatchsuggestions/:id").put(updateCoMatchSuggestion);
router.route("/comatchsuggestions/:id").delete(deleteCoMatchSuggestion);

export default router;