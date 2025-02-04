import { Request, Response } from "express";
import { refreshTokens, users } from "../../db/schema";
import { db } from "../../db/index";
import { sql } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Define the JWT payload interface
interface JWTPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

const handleError = (res: Response, status: number, message: string) => {
    res.status(status).json({ success: false, error: message });
};

const logout = async (req: Request, res: Response) => {
    const { email } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return handleError(res, 401, "Missing Authorization header");
    }
    
    const refreshToken = authHeader.split(" ")[1];
    
    try {
        // Check if refresh token exists
        const [token] = await db
            .select()
            .from(refreshTokens)
            .where(sql`token = ${refreshToken}`)
            .limit(1);
            
        if (!token) {
            return handleError(res, 401, "Refresh token not found");
        }
        
        // Check if refresh token is valid
        const refreshTokenValid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JWTPayload;
        
        if (!refreshTokenValid) {
            return handleError(res, 401, "Invalid refresh token");
        }
        
        // Get user ID from email
        const [user] = await db
            .select({ id: users.id })
            .from(users)
            .where(sql`email = ${email}`)
            .limit(1);
            
        if (!user) {
            return handleError(res, 404, "User not found");
        }
        
        // Check if token belongs to user
        if (refreshTokenValid.id !== user.id) {
            return handleError(res, 401, "Refresh token does not belong to the user");
        }
        
        // Delete refresh token
        await db
            .delete(refreshTokens)
            .where(sql`token = ${refreshToken}`);
            
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Logout error:', error);
        return handleError(res, 500, "Server error");
    }
};

export default logout;