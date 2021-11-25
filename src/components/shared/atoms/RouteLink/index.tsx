import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface RouteLinkProps extends LinkProps {
  children: ReactNode;
}

function RouteLink({ children, ...rest }: RouteLinkProps) {
  return (
    <Link passHref {...rest}>
      <a>{children}</a>
    </Link>
  );
}

export default RouteLink;
