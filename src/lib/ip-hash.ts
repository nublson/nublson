import { createHash } from "crypto";

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET ?? "";
  return createHash("sha256").update(ip + secret).digest("hex");
}
