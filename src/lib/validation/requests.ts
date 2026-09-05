// Shared between server-only query/action code and client components
// (e.g. RequestStatusSelect) — must never import anything server-only
// itself (no next/headers, no @/lib/supabase/server), or it drags that
// dependency into every client bundle that imports it.
export const requestStatuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
export type RequestStatus = (typeof requestStatuses)[number];
