import { Request, Response } from "express";
import { refreshTokens, users } from "../../db/schema";
import { db } from "../../db/index";
import jwt from "jsonwebtoken";
import { sql } from "drizzle-orm";
import { RefreshReq } from "../../../../shared/refresh.types"
import { Errors } from "../../../../shared/refresh.types";
import { RefreshRes } from "../../../../shared/refresh.types";
import refreshValidator from "../../utils/refresh.validator";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, error: message });
};


export const refresh = async (req: Request, res: Response) => {
  const { refreshToken , email } = req.body;

  const r : RefreshReq = {
    refreshToken,
    email,
  }

  try {

    // Validate required fields
    const errors : Errors = refreshValidator(r);
    if (Object.keys(errors).length > 0) {
      return handleError(res, 400, "Invalid request body");
    }
    // Check if refresh token exists
    let [token] = await db.select().from(refreshTokens).where(sql`token = ${refreshToken}`).limit(1);
    if (!token) {
      return handleError(res, 401, "Invalid refresh token");
    }

    // Check if refresh token is valid
    const refreshTokenValid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (!refreshTokenValid) {
      return handleError(res, 401, "Invalid refresh token");
    }

    let [user]= await db.select().from(users).where(sql`email = ${email}`).limit(1);

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    const updateRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    await db.update(refreshTokens).set({
      token : updateRefreshToken,
    }).where(sql`token = ${refreshToken}`);

    const re : RefreshRes = {
      success: true,
      data: {
        accessToken,
        refreshToken: updateRefreshToken
      }
    }

    return res.status(200).json(re);

  } catch (error: any) {
    // Handle unique constraint violations
    if (error.code === '23505') {
      return handleError(res, 409, "Username or email already exists");
    }
    return handleError(res, 500, "Server error");
  }
};

