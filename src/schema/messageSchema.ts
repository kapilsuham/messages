import { z } from "zod"

export const messageSchema=z.object({
    cotent: z.string().min(1,"message must be at least 1 character").max(300,"content must be no longer than 300 character")
    })