import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

export default function CustomLink(
  props: LinkProps & { children: ReactNode; className?: string }
) {
  const target = props.href.toString().match(/https?:\/\//)
    ? { target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Link href={props.href}>
      <a
        {...target}
        {...(props.className ? { className: props.className } : {})}
      >
        {props.children}
      </a>
    </Link>
  );
}
