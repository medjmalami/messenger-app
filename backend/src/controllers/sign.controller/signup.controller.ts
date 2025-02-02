import { Request, Response } from "express";
import { users } from "../../db/schema";
import { db } from "../../db/index";
import jwt from "jsonwebtoken";
import { SignupReq } from "../../../../shared/signup.types"
import { Errors } from "../../../../shared/signup.types";
import { sql } from "drizzle-orm";
import { refreshTokens } from "../../db/schema";
import { hashPassword } from "../../utils/hash_password";
import { SignupRes } from "../../../../shared/signup.types";
import { signupValidator } from "../../utils/signup.validator";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
   res.status(status).json({ success: false, error: message });

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
       handleError(res, 400, "Invalid request body");
       return
    }

    // Check if user already exists
    let [user] = await db.select().from(users).where(sql`username = ${username} OR email = ${email}`).limit(1);
    if (user) {
       handleError(res, 409, "Username or email already exists");
       return
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

    const re : SignupRes = {
      success: true,
      data: {
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken
      }
    }

    res.status(201).json(re);
    

  } catch (error: any) {
    console.log(error);
    // Handle unique constraint violations
    if (error.code === '23505') {
      handleError(res, 409, "Username or email already exists");
      return
    }

    handleError(res, 500, "Server error");
    return
  }
};

export default signup;