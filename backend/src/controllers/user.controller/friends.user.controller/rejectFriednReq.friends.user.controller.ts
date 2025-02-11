import { Request, Response } from "express";
import { friendRequests, users } from "../../../db/schema";
import { db } from "../../../db/index";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  res.status(status).json({ success: false, error: message });
};

const rejectFriendRequest = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { rejectedUsername } = req.body;

  if (!authHeader) {
    handleError(res, 401, "Missing Authorization header");
    return;
  }

  if (!rejectedUsername) {
    handleError(res, 400, "Rejected username is required");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    const userId = decoded.userId;

    // Check if user is trying to reject request from themselves
    const [sender] = await db
      .select()
      .from(users)
      .where(sql`${users.username} = ${rejectedUsername}`);

    if (!sender) {
      handleError(res, 404, "User not found");
      return;
    }

    // check if the user has pending friend request from the sender
    const [pendingFriendRequest] = await db
      .select()
      .from(friendRequests)
      .where(
        sql`${friendRequests.senderId} = ${sender.id} AND ${friendRequests.receiverId} = ${userId} AND ${friendRequests.status} = 'pending'`
      );

    if (!pendingFriendRequest) {
      handleError(res, 400, "No pending friend request found");
      return;
    }

    // Update the friend request status to rejected
    await db
      .update(friendRequests)
      .set({ status: "rejected" })
      .where(
        sql`${friendRequests.senderId} = ${sender.id} AND ${friendRequests.receiverId} = ${userId} AND ${friendRequests.status} = 'pending'`
      );

    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: (error as Error).message,
    });
  }
};

export default rejectFriendRequest;