import { z } from "zod"

export const verifySchema=z.object({
    code:z.string().length(6,"code at least require 6 character")
    })