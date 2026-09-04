/**
 * One-off local script to provision an administrator account.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts --email=you@example.com --name="Your Name"
 *
 * Creates (or reuses, if the email already has an auth account) a Supabase
 * Auth user and links it to a `profiles` row with role='admin'. Generates a
 * random password and prints it once — it is never stored by this script.
 * Requires SUPABASE_SERVICE_ROLE_KEY, so it must only ever be run locally,
 * never deployed or exposed as an API route.
 */
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.types";

function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const env: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

function generatePassword(): string {
  return randomBytes(18).toString("base64url");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = args.email;
  const fullName = args.name;

  if (!email || !fullName) {
    console.error(
      'Usage: npx tsx scripts/create-admin.ts --email=you@example.com --name="Your Name"',
    );
    process.exit(1);
  }

  const fileEnv = readEnvFile(".env.local");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fileEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? fileEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (checked process.env and .env.local).",
    );
    process.exit(1);
  }

  const supabase = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId: string;
  let password: string | null = null;

  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to look up existing users:", listError.message);
    process.exit(1);
  }

  const existing = existingUsers.users.find((u) => u.email === email);

  if (existing) {
    userId = existing.id;
    console.log(`Auth user already exists for ${email} (id: ${userId}). Reusing it.`);
  } else {
    password = generatePassword();
    const { data: created, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError || !created.user) {
      console.error("Failed to create auth user:", createError?.message);
      process.exit(1);
    }

    userId = created.user.id;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: userId, full_name: fullName, role: "admin" });

  if (profileError) {
    console.error("Failed to upsert admin profile:", profileError.message);
    process.exit(1);
  }

  console.log(`\nAdmin profile ready for ${email} (id: ${userId}).`);
  if (password) {
    console.log(`Temporary password (save it now, it will not be shown again):\n\n  ${password}\n`);
    console.log("Sign in at /admin/login and change the password afterward.");
  } else {
    console.log("No new password was generated — the existing account's password is unchanged.");
  }
}

main();
