// @ts-ignore
import { useEffect, useState, useTransition, useRef } from "react";
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

const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);

  return isMountRef.current;
};

const useData = (cacheKey: string, fetcher: any) => {
  const isMount = useIsMount();
  const [resource, setResource] = useState(
    getResource(cacheKey, fetcher, true)
  );

  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  });

  useEffect(() => {
    if (!isMount) {
      startTransition(() => {
        setResource(getResource(cacheKey, fetcher, false));
      });
    }
  }, [cacheKey]);

  const data = resource.read();

  return {
    data,
    refresh: () => {
      startTransition(() => {
        queryCache[cacheKey] = null;
        setResource(getResource(cacheKey, fetcher));
      });
    },
    isPending,
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

export const useMutation = (fetcher) => {
  const [resource, setResource] = useState(null);
  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  });

  const execMutation = (variables) => {
    const promise = fetcher(variables);

    startTransition(() => {
      setResource(suspenseWrapPromise(promise));
    });

    return promise;
  };

  const result = resource ? resource.read() : null;

  return [execMutation, { isPending, result }];
};
