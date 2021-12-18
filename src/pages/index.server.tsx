import { Suspense } from "react";

import A from "../components/a";
import B from "../components/b.server";

export default function Index() {
  return (
    <>
      <h1 className="text-3xl font-bold text-emerald-400 p-10">
        Buzzword Bookshop!
      </h1>
      {/* <Suspense fallback={"Loading A..."}>
        <A />
      </Suspense> */}
      {[
        { cacheKey: "B1", sleepMs: 200 },
        { cacheKey: "B2", sleepMs: 500 },
        { cacheKey: "B3", sleepMs: 1000 },
      ].map(({ cacheKey, sleepMs }) => (
        <div key={cacheKey} className="m-5 p-5 border border-green-500">
          <Suspense fallback={`Loading ${cacheKey}...`}>
            <B sleepMs={sleepMs} cacheKey={cacheKey} />
          </Suspense>
        </div>
      ))}
    </>
  );
}
