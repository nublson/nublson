import Link from "next/link";
import { IRouteLinkProps } from "../../../../utils/types";

function RouteLink({ children, ...rest }: IRouteLinkProps) {
  return (
    <Link passHref {...rest} prefetch={false}>
      <a>{children}</a>
    </Link>
  );
}

export default RouteLink;
