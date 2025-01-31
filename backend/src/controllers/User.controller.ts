import { Request, Response } from "express";
import { users } from "../db/schema";
import { db } from "../db/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function for error handling
const handleError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, error: message });
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      return handleError(res, 400, "All fields are required");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const [user] = await db.insert(users).values({
      username,
      email,
      passwordHash,
    }).returning();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token
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

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Validate required fields
    if (!username || !password) {
      return handleError(res, 400, "Username and password are required");
    }

    // Find user
    const [user] = await db.select().from(users)
      .where(users.username === username);

    if (!user) {
      return handleError(res, 401, "Invalid credentials");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return handleError(res, 401, "Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token
      }
    });

  } catch (error) {
    return handleError(res, 500, "Server error");
  }
};