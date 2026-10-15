import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import { Typography } from "../../typography";

export const Heading1Block = withContentValidation((props: DropedProps) => (
  <Typography component="h2" variant="h3" className="w-full mt-10!">
    {props.children}
  </Typography>
));

export const Heading2Block = withContentValidation((props: DropedProps) => (
  <Typography component="h2" variant="h3" className="w-full mt-8!">
    {props.children}
  </Typography>
));

export const Heading3Block = withContentValidation((props: DropedProps) => (
  <Typography component="h3" variant="h4" className="w-full mt-6!">
    {props.children}
  </Typography>
));
