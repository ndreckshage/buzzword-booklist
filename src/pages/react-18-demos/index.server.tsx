import Link from "ui/components/common/link.client";

export default function Demos() {
  return (
    <div className="container mx-auto px-4 my-10 space-x-4">
      <Link href="/react-18-demos/ssr-suspense-with-rsc">
        SSR Suspense with RSC
      </Link>
      <Link href="/react-18-demos/ssr-suspense-without-rsc">
        SSR Suspense without RSC
      </Link>
    </div>
  );
}
