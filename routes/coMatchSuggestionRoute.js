import { Router } from "express";
import { getAllCoMatchSuggestions, getCoMatchSuggestionById, createCoMatchSuggestion, updateCoMatchSuggestion, deleteCoMatchSuggestion } from "../controllers/coMatchSuggestionController.js";

const router = Router();

router.route("/comatchsuggestions").get(getAllCoMatchSuggestions);
router.route("/comatchsuggestion/:id").get(getCoMatchSuggestionById);
router.route("/comatchsuggestion/create").post(createCoMatchSuggestion);
router.route("/comatchsuggestion/update/:id").put(updateCoMatchSuggestion);
router.route("/comatchsuggestion/delete/:id").delete(deleteCoMatchSuggestion);

export default router;