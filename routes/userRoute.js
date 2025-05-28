import { createUser, deleteUser, getActiveUser, getUserByID, getAllUsers, updateUser, updateActiveUser } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.route("/user/update/:id").put(updateUser);

router.route("/users").get(getAllUsers);
router.route("/user/:id").get(getUserByID);
router.route("/user").get(getActiveUser);
router.route("/user/create").post(createUser);
router.route("/user/delete/:id").delete(deleteUser);

router.route("/user/update").put(updateActiveUser);
export default router;