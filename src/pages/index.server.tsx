import { Suspense } from "react";

import RscExample from "../components/rsc-example.server";

export default function Index() {
  return (
    <>
      <h2 className="text-xl m-5 p-5 text-purple-500">Homepage...</h2>
      {[
        { cacheKey: "B1", sleepMs: 200 },
        { cacheKey: "B2", sleepMs: 500 },
        { cacheKey: "B3", sleepMs: 1000 },
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
