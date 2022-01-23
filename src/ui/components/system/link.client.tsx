import CommonLink from "ui/components/common/link.client";
import {
  type LinkComponent,
  LinkComponentVariant,
} from "api/__generated__/resolvers-types";
import cx from "classnames";

export default function Link(props: LinkComponent) {
  return (
    <CommonLink
      href={props.href}
      className={cx({
        "bg-indigo-500 text-white no-underline rounded-lg p-4 inline-block":
          props.variant === LinkComponentVariant.Button,
      })}
    >
      {props.title}
    </CommonLink>
  );
}
