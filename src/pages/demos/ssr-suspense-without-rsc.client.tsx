import { Suspense, useState } from "react";
import useQuery from "lib/use-query.client";

const env = typeof window === "undefined" ? "server" : "browser";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Demo = ({ cacheKey, delay }: { cacheKey: string; delay: number }) => {
  const [refetchCount, setRefetchCount] = useState(0);
  const { data, hydrateClient, refetch } = useQuery(cacheKey, async () => {
    await sleep(delay);
    return {
      data: {
        cacheKey,
        refetchCount,
        delay,
        env,
      },
    };
  });

  return (
    <div>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
      <button
        className="bg-blue-500 text-white p-4 m-4"
        onClick={() => {
          setRefetchCount(refetchCount + 1);
          refetch();
        }}
      >
        Refetch {cacheKey} - {refetchCount}
      </button>
      {hydrateClient}
    </div>
  );
};

const SuspenseDemo = () => {
  return (
    <>
      <h1>Suspense demo without server components .... </h1>
      <div className="flex">
        <Suspense fallback="suspending a1...">
          <Demo cacheKey="a1" delay={500} />
        </Suspense>
        <Suspense fallback="suspending a2...">
          <Demo cacheKey="a2" delay={1500} />
        </Suspense>
        <Suspense fallback="suspending a3...">
          <Demo cacheKey="a3" delay={1000} />
        </Suspense>
        <Suspense fallback="suspending a4...">
          <Demo cacheKey="a4" delay={0} />
        </Suspense>
      </div>
    </>
  );
};

export default SuspenseDemo;
