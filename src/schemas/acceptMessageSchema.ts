import { z } from "zod";

export const acceptMessageSchema = z.object({
    messageId: z.string(),
    isAccepted: z.boolean()
})
