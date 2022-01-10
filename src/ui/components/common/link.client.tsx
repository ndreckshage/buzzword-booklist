import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";
import cx from "classnames";

const linkClass = cx({
  underline: true,
  "text-blue-600": true,
  "hover:text-blue-800": true,
  "visited:text-purple-600": true,
});

export default function CustomLink(props: LinkProps & { children: ReactNode }) {
  const target = props.href.toString().match(/https?:\/\//)
    ? { target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Link href={props.href}>
      <a className={linkClass} {...target}>
        {props.children}
      </a>
    </Link>
  );
}
