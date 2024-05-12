import { z } from "zod";

export const messageSchema = z.object({
    messageId: z
    .string()
    .min(10, {message: "Content must be atleast 10 characters"})
    .max(300, {message: "Content too large"})
})
