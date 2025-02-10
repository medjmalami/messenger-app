import { Request , Response } from "express";
import { db } from "../../db/index";
import { users } from "../../db/schema";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { ForgotPassReqSchema, ForgotPassRes } from "../../../../shared/forgotPass.types";

const handleError = (res: Response, status: number, message: string) => {
    res.status(status).json({ success: false, error: message });
};

const forgotPass = async (req: Request, res: Response) => {
    try {
        const { email } = req.body ;

        const validated = ForgotPassReqSchema.safeParse({ email });
        if (!validated.success) {
            handleError(res, 400, "Invalid request ");
            return;
        }
    
        const [user] = await db.select().from(users).where(eq(users.email, email));
        
        if (!user) {
           res.status(404).json({ message: 'User not found' });
           return
        }
    
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000);
    
        await db.update(users)
          .set({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpires
          })
          .where(eq(users.id, user.id));
    
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          service: process.env.SMTP_SERVICE,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }).sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject: 'Password Reset Request',
          html: `
            <p>You requested a password reset</p>
            <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
            <p>This link will expire in 1 hour</p>
          `
        });

        const response: ForgotPassRes = {
            success: true,
            data: {
                message: 'Password reset email sent',
            }
        };
        res.status(200).json(response);
        return;
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
        return;
      }
};

export default forgotPass;




