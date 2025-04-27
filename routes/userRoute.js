import { createUser, deleteUser, getActiveUser, getUserByID, getUsers, updateUser } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.route("/users").get( getUsers);
router.route("/user/:id").get( getUserByID);
router.route("/user").get(getActiveUser);
router.route("/user/create").post(createUser);
router.route("/user/delete/:id").delete(deleteUser);
router.route("/user/update").put(updateUser);
export default router;