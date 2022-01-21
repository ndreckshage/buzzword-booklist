import { Suspense } from "react";
import Refresher from "ui/components/demos/rsc-refresher.client";
import { useData } from "ui/lib/use-data.server";

const env = typeof window === "undefined" ? "server" : "browser";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Demo = ({
  cacheKey,
  delay,
  refreshCount,
}: {
  cacheKey: string;
  delay: number;
  refreshCount: number;
}) => {
  const data = useData(cacheKey, async () => {
    await sleep(delay);
    return {
      data: {
        cacheKey,
        refreshCount,
        delay,
        env,
      },
    };
  });

  return (
    <>
      <div>
        <code>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </code>
      </div>
      {cacheKey === "a2" && (
        <Suspense fallback="suspending a5...">
          <Demo cacheKey="a5" delay={3000} refreshCount={refreshCount} />
        </Suspense>
      )}
    </>
  );
};

type Props = {
  refreshCount?: number;
};

const SuspenseDemo = (props: Props) => {
  const refreshCount = props.refreshCount || 0;

  return (
    <div className="container mx-auto my-10 space-x-4">
      <h1>Suspense demo with server components .... </h1>
      <Refresher>
        <Suspense fallback="suspending a1...">
          <Demo cacheKey="a1" delay={500} refreshCount={refreshCount} />
        </Suspense>
        <Suspense fallback="suspending a2...">
          <Demo cacheKey="a2" delay={1500} refreshCount={refreshCount} />
        </Suspense>
        <Suspense fallback="suspending a3...">
          <Demo cacheKey="a3" delay={1000} refreshCount={refreshCount} />
        </Suspense>
        <Suspense fallback="suspending a4...">
          <Demo cacheKey="a4" delay={0} refreshCount={refreshCount} />
        </Suspense>
      </Refresher>
    </div>
  );
};

export default SuspenseDemo;
