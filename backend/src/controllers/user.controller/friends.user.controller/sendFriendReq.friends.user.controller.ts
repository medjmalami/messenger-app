import { Request, Response } from "express";
import { friendRequests, users } from "../../../db/schema";
import { db } from "../../../db/index";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  res.status(status).json({ success: false, error: message });
};

const sendFriendRequest = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { receiverUsername } = req.body;

  if (!authHeader) {
    handleError(res, 401, "Missing Authorization header");
    return;
  }

  if (!receiverUsername) {
    handleError(res, 400, "Receiver username is required");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    const userId = decoded.userId;

    // Check if user is trying to send request to themselves
    const [sender] = await db
      .select()
      .from(users)
      .where(sql`${users.id} = ${userId}`);

    if (sender.username === receiverUsername) {
      handleError(res, 400, "Cannot send friend request to yourself");
      return;
    }

    // Check if the receiver exists
    const [receiver] = await db
      .select()
      .from(users)
      .where(sql`${users.username} = ${receiverUsername}`);

    if (!receiver) {
      handleError(res, 404, "Receiver not found");
      return;
    }

    // Check if the user has already sent a friend request or is already friends
    const [existingFriend] = await db
      .select()
      .from(friendRequests)
      .where(
        sql`(
          (${friendRequests.senderId} = ${userId} AND ${friendRequests.receiverId} = ${receiver.id})
          OR 
          (${friendRequests.senderId} = ${receiver.id} AND ${friendRequests.receiverId} = ${userId})
        ) 
        AND 
        (${friendRequests.status} = 'pending' OR ${friendRequests.status} = 'accepted')`
      );

    if (existingFriend) {
      const status = existingFriend.status === 'pending' ? 'request already sent' : 'already friends';
      handleError(res, 400, `Friend ${status}`);
      return;
    }

    // Create a new friend request
    const [newFriendRequest] = await db
      .insert(friendRequests)
      .values({
        senderId: userId,
        receiverId: receiver.id,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    res.status(200).json({
      success: true,
      data: {
        id: newFriendRequest.id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: (error as Error).message,
    });
  }
};

export default sendFriendRequest;