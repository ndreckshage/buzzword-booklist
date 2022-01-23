import { Suspense } from "react";
import { useRouter } from "next/router";
import EditLayoutContainer from "ui/components/system-edit/container";

export default function EditLayoutPage() {
  const router = useRouter();
  const layoutId = router.query.layout;

  // // @NOTE next params dont work with streaming / nextjs yet
  //  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const pid = router.asPath.match(/\/manage\/layouts\/(.*)\/edit/)?.[1];
  // if (!pid) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  if (typeof layoutId !== "string") {
    return <p>No layout to edit!</p>;
  }

  return (
    <Suspense
      fallback={<div className="container mx-auto my-5">Loading Layout..</div>}
    >
      <EditLayoutContainer id={layoutId} />
    </Suspense>
  );
}
