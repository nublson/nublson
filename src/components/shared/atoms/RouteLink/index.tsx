import Link from "next/link";
import { IRouteLinkProps } from "../../../../utils/types";

function RouteLink({ children, ...rest }: IRouteLinkProps) {
  return (
    <Link passHref {...rest} prefetch={false}>
      {children}
    </Link>
  );
}

export default RouteLink;
