import Link from "next/link";
import cx from "classnames";

const linkClass = cx({
  underline: true,
  "text-blue-600": true,
  "hover:text-blue-800": true,
  "visited:text-purple-600": true,
});

export default function ManageLayouts() {
  return (
    <>
      <p>Manage Lists</p>
      <Link href="/manage/layouts/create">
        <a className={linkClass}>Create Layout</a>
      </Link>
      <Link href="/manage/layouts/32442">
        <a className={linkClass}>View Layout</a>
      </Link>
      <Link href="/manage/layouts/32442/edit">
        <a className={linkClass}>Edit Layout</a>
      </Link>
    </>
  );
}
