import "server-only";
import { headers } from "next/headers";

/** The current request's origin (scheme + host), for building absolute email redirect URLs. */
export async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
