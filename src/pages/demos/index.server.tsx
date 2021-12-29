import Link from "ui/components/common/link.client";

export default function Demos() {
  return (
    <div className="m-5 p-5 space-x-4">
      <Link href="/demos/ssr-suspense-with-rsc">SSR Suspense with RSC</Link>
      <Link href="/demos/ssr-suspense-without-rsc">
        SSR Suspense without RSC
      </Link>
      <Link href="/demos/css-grid">CSS Grid</Link>
      <Link href="/demos/css-carousel">CSS Carousel</Link>
    </div>
  );
}
