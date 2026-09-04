import { z } from "zod";

export const inviteAdminSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  fullName: z.string().trim().min(1, "Name is required").max(200),
});
export type InviteAdminInput = z.infer<typeof inviteAdminSchema>;

export const setPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
