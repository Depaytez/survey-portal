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

// For the OTP-code flow (invite acceptance, password reset) — a numeric
// code typed in by hand, never a clickable link. See otp-password-form.tsx
// for why: email security scanners "click" links to scan them, which burns
// a one-time link token before the real person ever sees it. A code the
// human has to type isn't something a scanner can consume.
//
// Length isn't hardcoded to a specific digit count: Supabase's invite and
// recovery tokens were empirically 8 digits at the time this was built
// (verified live against the real project, not assumed from config.toml's
// otp_length setting, which turned out not to govern these two token
// types) — a range tolerates that changing without this becoming stale.
export const otpPasswordSchema = z
  .object({
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    code: z.string().trim().regex(/^\d{6,10}$/, "Enter the code from your email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type OtpPasswordInput = z.infer<typeof otpPasswordSchema>;
