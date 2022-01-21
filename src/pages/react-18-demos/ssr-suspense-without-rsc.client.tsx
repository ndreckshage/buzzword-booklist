// @ts-ignore remove when react 18 types supported
import { Suspense, useEffect, useState, useTransition } from "react";
import { useData } from "ui/lib/use-data.client";
import suspenseWrapPromise from "ui/lib/suspense-wrap-promise";
import cx from "classnames";

const env = typeof window === "undefined" ? "server" : "browser";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Demo = ({ cacheKey, delay }: { cacheKey: string; delay: number }) => {
  const [refreshCount, setRefreshCount] = useState(0);
  const { data, hydrateClient, refresh, isPending } = useData<{
    cacheKey: string;
    refreshCount: number;
    delay: number;
    env: string;
  }>(cacheKey, async () => {
    await sleep(delay);
    return {
      cacheKey,
      refreshCount,
      delay,
      env,
    };
  });

  useEffect(() => {
    if (refreshCount !== data.refreshCount) refresh();
  }, [refreshCount, data.refreshCount, refresh]);

  return (
    <div
      className={cx("transition-opacity", {
        "opacity-100": !isPending,
        "opacity-50": isPending,
      })}
    >
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
      <button
        className="bg-blue-500 text-white p-4 m-4"
        onClick={() => {
          setRefreshCount((x) => x + 1);
        }}
      >
        Refresh
      </button>
      {/* IMPORTANT!!!!!! */}
      {hydrateClient}
    </div>
  );
};

const Adhoc = ({ resource }: { resource: { read: () => {} } }) => {
  const data = resource.read();
  return (
    <code>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </code>
  );
};

const SuspenseDemo = () => {
  const [adhocResource, setAdhocResource] = useState<{ read: () => {} } | null>(
    null
  );

  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  });

  return (
    <div className="container mx-auto my-10 space-x-4">
      <h1>Suspense demo without server components .... </h1>
      <div className="flex">
        <Suspense fallback="Loading a1...">
          <Demo cacheKey="a1" delay={500} />
        </Suspense>
        <Suspense fallback="Loading a2...">
          <Demo cacheKey="a2" delay={1500} />
        </Suspense>
        <Suspense fallback="Loading a3...">
          <Demo cacheKey="a3" delay={1000} />
        </Suspense>
        <Suspense fallback="Loading a4...">
          <Demo cacheKey="a4" delay={0} />
        </Suspense>
        <div
          className={cx("transition-opacity", {
            "opacity-100": !isPending,
            "opacity-50": isPending,
          })}
        >
          <button
            className="bg-blue-500 text-white p-4 m-4"
            onClick={() => {
              startTransition(() => {
                setAdhocResource(
                  suspenseWrapPromise(
                    (async () => {
                      await sleep(1000);
                      return { foo: "bar" };
                    })()
                  )
                );
              });
            }}
          >
            {adhocResource ? "Refresh" : "Show"} adhoc (no useData)
          </button>
          {adhocResource && (
            <Suspense fallback="Loading adhoc...">
              <Adhoc resource={adhocResource} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuspenseDemo;
