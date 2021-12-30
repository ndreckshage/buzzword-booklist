import CommonLink from "ui/components/common/link.client";
import { type LinkComponent } from "api/__generated__/resolvers-types";

export default function Link(props: LinkComponent) {
  return <CommonLink href={props.href}>{props.title}</CommonLink>;
}
