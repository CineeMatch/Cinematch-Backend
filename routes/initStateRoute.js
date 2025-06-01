import express from "express";
import { getAllMoviesForDb } from "../controllers/initStateContoller.js";
import initAuthMiddleware from "../middlewares/initStateMiddleware.js";

const router = express.Router();

router.route("/initstate").post( initAuthMiddleware,getAllMoviesForDb);


export default router;