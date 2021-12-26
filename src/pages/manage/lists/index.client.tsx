import Link from "next/link";
import cx from "classnames";

const linkClass = cx({
  underline: true,
  "text-blue-600": true,
  "hover:text-blue-800": true,
  "visited:text-purple-600": true,
});

export default function ManageLists() {
  return (
    <>
      <p>Manage Lists</p>
      <Link href="/manage/lists/create">
        <a className={linkClass}>Create List</a>
      </Link>
      <Link href="/manage/lists/edit?list=nicks-list">
        <a className={linkClass}>Edit nicks List</a>
      </Link>
    </>
  );
}
