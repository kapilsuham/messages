import { z } from "zod"

export const UserNameValidation=z
    .string()
    .min(2,"username atleast require 2 character")
    .max(20,"username not more than 20 character")
    .regex(/^[a-zA-Z0-9]+$/,"username must not contain special character")
export const signUpSchema=z.object({
    userName:UserNameValidation,
    email:z.string().email({message:"invalid email"}),
    password:z.string().min(6,"password must be atleast 6 charactor")
})    