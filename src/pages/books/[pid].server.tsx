import { useEffect, Suspense } from "react";
import RscExample from "components/rsc-example.server";

type Props = {
  router: { asPath: string };
};

export default function BookShow(props: Props) {
  // @NOTE next params dont work with streaming / nextjs yet
  const pid = props.router.asPath.match(/\/books\/(.*)/)?.[1];
  if (!pid) {
    return <>Bad Route Match: {props.router.asPath}</>;
  }

  return (
    <>
      <h2 className="text-xl m-5 p-5 text-purple-500">Book: {pid}</h2>
      {[
        { cacheKey: "Book1", sleepMs: 0 },
        { cacheKey: "Book2", sleepMs: 1000 },
        { cacheKey: "Book3", sleepMs: 2000 },
      ].map(({ cacheKey, sleepMs }) => (
        <div key={cacheKey} className="m-5 p-5 border border-green-500">
          <Suspense fallback={`Loading ${cacheKey}...`}>
            <RscExample sleepMs={sleepMs} cacheKey={cacheKey} />
          </Suspense>
        </div>
      ))}
    </>
  );
}
