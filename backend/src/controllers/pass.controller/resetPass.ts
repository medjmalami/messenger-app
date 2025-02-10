import { Request , Response } from "express";
import { db } from "../../db/index";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { and, gt } from "drizzle-orm";
import { ResetPassReqSchema, ResetPassRes } from "../../../../shared/resetPass.types";

const handleError = (res: Response, status: number, message: string) => {
    res.status(status).json({ success: false, error: message });
};


const resetPass = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body ;

        const validated = ResetPassReqSchema.safeParse({ token, newPassword });
        if (!validated.success) {
            handleError(res, 400, "Invalid request ");
            return;
        }
    
        const [user] = await db.select().from(users)
          .where(and(
            eq(users.resetPasswordToken, token),
            gt(users.resetPasswordExpires, new Date())
          ));
    
        if (!user) {
          res.status(400).json({ message: 'Invalid or expired token' });
          return        
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await db.update(users)
          .set({
            passwordHash: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
          })
          .where(eq(users.id, user.id));

          const response: ResetPassRes = {
            success: true,
            data: {
                message: 'Password reset successful',
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

export default resetPass;