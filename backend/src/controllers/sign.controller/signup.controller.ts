import { Request, Response } from "express";
import { users } from "../../db/schema";
import { db } from "../../db/index";
import jwt from "jsonwebtoken";
import { SignupReq } from "../../../../shared/signup.types"
const {signupValidator} = require('../utils/signup.validator')
import { Errors } from "../../../../shared/signup.types";
import { sql } from "drizzle-orm";
import { refreshTokens } from "../../db/schema";
import { hashPassword } from "../../utils/hash_password";


// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, error: message });
};



const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const r : SignupReq = {
    username,
    email,
    password,
  }
  
  try {
    // Validate required fields
    const errors : Errors = signupValidator(r);
    if (Object.keys(errors).length > 0) {
      return handleError(res, 400, "Invalid request body");
    }

    // Check if user already exists
    let [user] = await db.select().from(users).where(sql`username = ${username} OR email = ${email}`).limit(1);
    if (user) {
      return handleError(res, 409, "Username or email already exists");
    }



    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    [user] = await db.insert(users).values({
      username,
      email,
      passwordHash,
    }).returning();


    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    await db.insert(refreshTokens).values({
      token : refreshToken,
    });
    

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken
      }
    });

  } catch (error: any) {
    // Handle unique constraint violations
    if (error.code === '23505') {
      return handleError(res, 409, "Username or email already exists");
    }
    return handleError(res, 500, "Server error");
  }
};

module.exports = {
  signup,
}