 import { z } from 'zod';

export const SignupReqSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export const SignupResSchema = z.object({
    success: z.boolean(),
    error: z.string().optional(),
    data: z.object({
        username: z.string(),
        email: z.string().email(),
        accessToken: z.string(),
        refreshToken: z.string(),
    }).optional(),
});

export type SignupReq = z.infer<typeof SignupReqSchema>;
export type SignupRes = z.infer<typeof SignupResSchema>;
