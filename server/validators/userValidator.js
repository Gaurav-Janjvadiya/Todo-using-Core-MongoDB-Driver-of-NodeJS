import { z } from "zod";

export const SignUpUser = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot axceed 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInUser = z.object({
  username: z.string(),
  password: z.string(),
});
