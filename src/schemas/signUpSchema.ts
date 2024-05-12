import { z } from "zod";

export const userNameSchema = z.string()
    .min(4, "Username must contain 4 characters atleast!")
    .max(10, "Username should not have more than 10 characters!")
    .regex(/^[a-zA-z0-9]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    userName: userNameSchema,
    email: z.string().email(),
    password: z.string().min(6, "Password must contain atleast 6 characters!")
})
