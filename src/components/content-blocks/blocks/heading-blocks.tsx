import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import { Typography } from "../../typography";

export const Heading1Block = withContentValidation((props: DropedProps) => (
  <Typography component="h1" variant="h2" className="w-full mt-15!">
    {props.children}
  </Typography>
));

export const Heading2Block = withContentValidation((props: DropedProps) => (
  <Typography component="h2" variant="h3" className="w-full mt-10! pb-2">
    {props.children}
  </Typography>
));

export const Heading3Block = withContentValidation((props: DropedProps) => (
  <Typography component="h3" variant="h4" className="w-full mt-8!">
    {props.children}
  </Typography>
));
