import { Request, Response } from "express";
import { friendRequests, users } from "../../../db/schema";
import { db } from "../../../db/index";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  res.status(status).json({ success: false, error: message });
};

const getFriendsRequests = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    handleError(res, 401, "Missing Authorization header");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    const userId = decoded.userId;

    // First, get all pending friend requests where the current user is the receiver
    const pendingRequests = await db
      .select({
        senderId: friendRequests.senderId,
      })
      .from(friendRequests)
      .where(
        sql`${friendRequests.receiverId} = ${userId} AND ${friendRequests.status} = 'pending'`
      )
      .orderBy(friendRequests.createdAt);

    // If there are no pending requests, return empty array
    if (pendingRequests.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    // Get array of sender IDs
    const senderIds = pendingRequests.map(request => request.senderId);

    // Fetch user information for all senders
    const senderUsers = await db
      .select({
        username: users.username,
      })
      .from(users)
      .where(sql`${users.id} IN (${senderIds})`);

    res.status(200).json({
      success: true,
      data: senderUsers,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: "Server error", 
      message: (error as Error).message 
    });
  }
};

export default getFriendsRequests;