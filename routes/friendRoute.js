import { getAllFriends, getFriendById, getUserFriends, createFriend, deleteFriend } from "../controllers/friendController.js";
import { Router } from "express";

const router = Router();

router.route("/friends").get(getAllFriends);
router.route("/friend/:id").get(getFriendById);
router.route("/friend/user/:userId").get(getUserFriends);
router.route("/friend/create").post(createFriend);
router.route("/friend/delete/:id").delete(deleteFriend);

export default router;