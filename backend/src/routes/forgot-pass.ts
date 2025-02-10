import express from 'express';
import { eq, and, gt } from 'drizzle-orm';
import { users } from '../db/schema';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from '../db/index';
import nodemailer from 'nodemailer';
const router = express.Router();


// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Forgot Password Route
router.post('/forgot-password', async (req : Request, res : Response) => {
  const { email } = req.body;

  try {
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await db.update(users)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires
      })
      .where(eq(users.id, user.id));

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
        <p>This link will expire in 1 hour</p>
      `
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find user with valid reset token
    const [user] = await db.select().from(users)
      .where(and(
        eq(users.resetPasswordToken, token),
        gt(users.resetPasswordExpires, new Date())
      ));

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    await db.update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
      .where(eq(users.id, user.id));

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;