import type { AppProps } from "next/app";
import { Suspense } from "react";
import Link from "next/link";
import cx from "classnames";
import "../styles/global.css";

const linkClass = cx({
  underline: true,
  "text-blue-600": true,
  "hover:text-blue-800": true,
  "visited:text-purple-600": true,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-emerald-400 p-10">
        Buzzword Bookshop!
      </h1>
      <div className="m-5 p-5 space-x-4">
        <Link href="/">
          <a className={linkClass}>Homepage</a>
        </Link>
        <Link href="/books/234234">
          <a className={linkClass}>Book</a>
        </Link>
        <Link href="/collections/lists/2345">
          <a className={linkClass}>List</a>
        </Link>
        <Link href="/collections/genres/522">
          <a className={linkClass}>Genre</a>
        </Link>
        <Link href="/collections/authors/24456">
          <a className={linkClass}>Author</a>
        </Link>
        <Link href="/manage/layouts">
          <a className={linkClass}>Manage Layouts</a>
        </Link>
        <Link href="/manage/lists">
          <a className={linkClass}>Manage Lists</a>
        </Link>
      </div>
      <Suspense fallback="Loading...">
        <Component {...pageProps} />
      </Suspense>
    </>
  );
}
