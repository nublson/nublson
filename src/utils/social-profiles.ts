import social from "@/data/social.json";

export type SocialProfile = { label: string; url: string };

export const socialProfiles: SocialProfile[] = social.media.map(
  ({ label, url }) => ({ label, url }),
);

/**
 * Profiles that get a favicon wherever they're linked (About, articles) but
 * stay out of Home's "Find me on…" line.
 */
const linkOnlyProfiles: SocialProfile[] = [
  { label: "Substack", url: "https://nublson.substack.com" },
];

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
  return (
    [...socialProfiles, ...linkOnlyProfiles].find(
      (profile) => hostOf(profile.url) === host,
    ) ?? null
  );
}
