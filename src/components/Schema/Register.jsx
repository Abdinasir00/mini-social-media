import { z } from "zod"

export  const RegisterSchema = z.object({
    name: z.string().min(1, "requied Your Name "),
    email: z.string().email(2, "requied Your email "),
    // email: z.string().("inValid Email"),
    password: z.string().min(6, "requied Your password ")
 })