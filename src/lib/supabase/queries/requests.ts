import { createClient } from "@/lib/supabase/server";
import type { RequestStatus } from "@/lib/validation/requests";

export type CustomerCareRequestRow = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
};

export async function listCustomerCareRequests(status?: string): Promise<CustomerCareRequestRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("customer_care_requests")
    .select("id, name, email, category, message, status, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to list customer care requests:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    category: row.category,
    message: row.message,
    status: row.status as RequestStatus,
    createdAt: row.created_at,
  }));
}

export type StakeholderRequestRow = {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string | null;
  interestType: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
};

export async function listStakeholderRequests(status?: string): Promise<StakeholderRequestRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("stakeholder_requests")
    .select(
      "id, organization_name, contact_name, email, phone, interest_type, message, status, created_at",
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to list stakeholder requests:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    organizationName: row.organization_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    interestType: row.interest_type,
    message: row.message,
    status: row.status as RequestStatus,
    createdAt: row.created_at,
  }));
}

export async function getRequestCounts(): Promise<{ customerCare: number; stakeholder: number }> {
  const supabase = await createClient();
  const [{ count: customerCare }, { count: stakeholder }] = await Promise.all([
    supabase
      .from("customer_care_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "NEW"),
    supabase
      .from("stakeholder_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "NEW"),
  ]);

  return { customerCare: customerCare ?? 0, stakeholder: stakeholder ?? 0 };
}
