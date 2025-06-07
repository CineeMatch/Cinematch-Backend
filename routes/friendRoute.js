import { getAllFriends, getFriendById, getUserFriends, createFriend, deleteFriend,acceptFriendRequest, rejectFriendRequest } from "../controllers/friendController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.route("/friends").get( authMiddleware, getAllFriends); 
router.route("/friend/user").get( authMiddleware, getUserFriends);
router.route("/friend/:id").get( authMiddleware, getFriendById);
router.route("/friend/create").post( authMiddleware, createFriend);
router.route("/friend/delete/:id").delete( authMiddleware, deleteFriend);
router.route("/friend/accept").put( authMiddleware, acceptFriendRequest);
router.route("/friend/reject").put( authMiddleware, rejectFriendRequest);

export default router;