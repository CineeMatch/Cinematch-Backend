import { getAllFriends, getFriendById, getUserFriends, createFriend, deleteFriend } from "../controllers/friendController.js";
import { Router } from "express";

const router = Router();

router.route("/friends").get(getAllFriends);
router.route("/friends/:id").get(getFriendById);
router.route("/friends/user/:userId").get(getUserFriends);
router.route("/friends").post(createFriend);
router.route("/friends/:id").delete(deleteFriend);

export default router;