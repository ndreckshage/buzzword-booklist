import Link from "next/link";
import { type ReactNode } from "react";
import cx from "classnames";

const linkClass = cx({
  underline: true,
  "text-blue-600": true,
  "hover:text-blue-800": true,
  "visited:text-purple-600": true,
});

type Props = {
  children: ReactNode;
  href: string;
};

export default function CustomLink(props: Props) {
  return (
    <Link href={props.href}>
      <a className={linkClass}>{props.children}</a>
    </Link>
  );
}
