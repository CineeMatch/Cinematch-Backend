import { createUser, deleteUser, getActiveUser, getUserByID, getAllUsers, updateUser, updateActiveUser } from "../controllers/userController.js";
import { uploadUserAvatar } from "../controllers/userController.js";
import express from "express";
import  authMiddleware  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/user/update/:id").put( authMiddleware,updateUser);

router.route("/users").get( authMiddleware,getAllUsers);
router.route("/user/:id").get( authMiddleware,getUserByID);
router.route("/user").get( authMiddleware,getActiveUser);
router.route("/user/create").post( authMiddleware,createUser);
router.route("/user/delete/:id").delete( authMiddleware,deleteUser);
router.route("/user/upload/avatar").post(authMiddleware, uploadUserAvatar)

router.route("/user/update").put( authMiddleware,updateActiveUser);
export default router;