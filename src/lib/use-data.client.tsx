// @ts-ignore
import { useEffect, useState, useTransition } from "react";
import suspenseWrapPromise from "./suspense-wrap-promise";

const queryCache: any = {};

const getResource = (cacheKey: string, fetcher: any, initialLoad = false) => {
  if (!queryCache[cacheKey]) {
    let fetcherPromise: any = null;
    let fetcherPromiseData: any =
      typeof window !== "undefined" && initialLoad
        ? // @ts-ignore
          window.queryData?.[cacheKey] ?? undefined
        : undefined;

    let wrappedFetcher = () => {
      if (fetcherPromiseData !== undefined) {
        return Promise.resolve(fetcherPromiseData);
      }

      if (!fetcherPromise) {
        fetcherPromise = fetcher().then((r: any) => (fetcherPromiseData = r));
      }

      return fetcherPromise;
    };

    queryCache[cacheKey] = suspenseWrapPromise(wrappedFetcher());
  }

  return queryCache[cacheKey];
};

const useData = (cacheKey: string, fetcher: any) => {
  const [resource, setResource] = useState(
    getResource(cacheKey, fetcher, true)
  );

  useEffect(() => {
    startTransition(() => {
      setResource(getResource(cacheKey, fetcher, false));
    });
  }, [cacheKey]);

  const [isRefreshing, startTransition] = useTransition({
    timeoutMs: 5000,
  });

  const data = resource.read();

  return {
    data,
    refresh: () => {
      startTransition(() => {
        queryCache[cacheKey] = null;
        setResource(getResource(cacheKey, fetcher));
      });
    },
    isRefreshing,
    hydrateClient: (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.queryData=window.queryData||{};window.queryData[${JSON.stringify(
            cacheKey
          )}] = ${JSON.stringify(data)}`,
        }}
      />
    ),
  };
};

export default useData;
