import { email, z } from "zod/v4";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name too short")
      .regex(/^[a-z A-Z]*$/),
    email: z.email("Email is not valid"),
    // username: z
    //   .string()
    //   .min(3, "Username too short")
    //   .max(20, "Username too long")
    //   .regex(/^[a-zA-Z0-9_]*$/, "Username can only contain letters, numbers, and underscores"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email("Email is not valid"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type signUpData = z.infer<typeof signUpSchema>;
export type signInData = z.infer<typeof signInSchema>;
