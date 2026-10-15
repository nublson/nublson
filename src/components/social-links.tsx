import { SectionWrapper } from "@/components/section-wrapper";
import { socialHandle, socialProfiles } from "@/utils/social-profiles";
import { Fragment } from "react";
import { FaviconLink, SocialIcon } from "./favicon-link";
import { Typography } from "./typography";

/** "Find me on [GitHub], [YouTube] and [Instagram]." */
export function SocialLinks() {
  const last = socialProfiles.length - 1;
  return (
    <Typography className="max-w-[60ch]">
      Find me on{" "}
      {socialProfiles.map((profile, i) => (
        <Fragment key={profile.label}>
          {i > 0 && (i === last ? " and " : ", ")}
          <FaviconLink href={profile.url} label={profile.label} />
        </Fragment>
      ))}
      .
    </Typography>
  );
}

export function ElsewhereList() {
  return (
    <SectionWrapper title="Elsewhere" id="elsewhere">
      <ul className="-mx-2.5 flex flex-col gap-1">
        {socialProfiles.map((profile) => (
          <li key={profile.label}>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline justify-between gap-4 rounded-lg px-2.5 py-2 transition-colors duration-150 ease-(--ease-out) hover:bg-muted"
            >
              <span className="flex items-center gap-2 text-foreground">
                <SocialIcon label={profile.label} />
                {profile.label}
              </span>
              <span className="text-subtle-foreground">
                {socialHandle(profile.url)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
