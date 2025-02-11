import { Request, Response } from "express";
import { friendRequests, users } from "../../../db/schema";
import { db } from "../../../db/index";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  res.status(status).json({ success: false, error: message });
};

const getFriendsList = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    handleError(res, 401, "Missing Authorization header");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    const userId = decoded.userId;

    // Get both sent and received accepted friend requests
    const friendConnections = await db
      .select({
        friendId: sql`CASE 
          WHEN ${friendRequests.senderId} = ${userId} THEN ${friendRequests.receiverId}
          ELSE ${friendRequests.senderId}
        END`,
      })
      .from(friendRequests)
      .where(
        sql`(${friendRequests.senderId} = ${userId} OR ${friendRequests.receiverId} = ${userId})
        AND ${friendRequests.status} = 'accepted'`
      )
      .orderBy(friendRequests.createdAt);

    // If no friends, return empty array
    if (friendConnections.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    // Get array of friend IDs
    const friendIds = friendConnections.map(connection => connection.friendId);

    // Fetch user information for all friends
    const friendUsers = await db
      .select({
        username: users.username,
      })
      .from(users)
      .where(sql`${users.id} IN (${friendIds})`);

    res.status(200).json({
      success: true,
      data: friendUsers,
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

export default getFriendsList;