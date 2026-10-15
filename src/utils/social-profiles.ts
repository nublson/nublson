import social from "@/data/social.json";

export type SocialProfile = { label: string; url: string };

export const socialProfiles: SocialProfile[] = social.media.map(
  ({ label, url }) => ({ label, url }),
);

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** The profile whose domain matches `url`, so any link to it can show its favicon. */
export function findSocialProfile(url: string): SocialProfile | null {
  const host = hostOf(url);
  if (!host) return null;
  return socialProfiles.find((profile) => hostOf(profile.url) === host) ?? null;
}

/** "@nublson" from a profile URL. */
export function socialHandle(url: string): string {
  const segment = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
  return `@${segment.replace(/^@/, "")}`;
}
