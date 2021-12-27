// @ts-ignore remove when react 18 types supported
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
  }, [isMountRef]);

  return isMountRef.current;
};

export default function useData<T>(
  cacheKey: string,
  fetcher: () => Promise<T>
) {
  const isMount = useIsMount();
  const [resource, setResource] = useState(
    getResource(cacheKey, fetcher, true)
  );

  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  }) as [boolean, any];

  useEffect(() => {
    if (!isMount) {
      startTransition(() => {
        setResource(getResource(cacheKey, fetcher, false));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  const data: T = resource.read();

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
}

export function useMutation<T, V>(fetcher: (variables: V) => Promise<T>) {
  const [resource, setResource] = useState<{ read: () => T } | null>(null);
  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  }) as [boolean, any];

  return [
    (variables: V) => {
      const promise = fetcher(variables);

      startTransition(() => {
        setResource(suspenseWrapPromise(promise));
      });

      return promise;
    },
    { data: resource ? resource.read() : null, isPending },
  ] as [(variables: V) => Promise<T>, { data: null | T; isPending: boolean }];
}
