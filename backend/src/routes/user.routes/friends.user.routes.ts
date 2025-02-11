import { Router } from "express";
import getFriendsList from "../../controllers/user.controller/friends.user.controller/getFriends.friends.user.controller";
import getFriendsRequests from "../../controllers/user.controller/friends.user.controller/getFriendsRequests.friends.user.controller";
import rejectFriendRequest from "../../controllers/user.controller/friends.user.controller/rejectFriendReq.friends.user.controller";
import sendFriendRequest from "../../controllers/user.controller/friends.user.controller/sendFriendReq.friends.user.controller";


const router = Router();

router.get("/friends", getFriendsList);
router.get("/requests", getFriendsRequests);
router.post("/send-friend-request", sendFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);

export default router;