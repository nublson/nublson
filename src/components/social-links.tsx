import { socialProfiles } from "@/utils/social-profiles";
import { Fragment } from "react";
import { FaviconLink } from "./favicon-link";
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
