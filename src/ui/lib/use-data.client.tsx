// @ts-ignore remove when react 18 types supported
import { useContext, useEffect, useState, useTransition, useRef } from "react";
import suspenseWrapPromise from "./suspense-wrap-promise";
import { DocumentNode } from "graphql/language/ast";
import { request, gql } from "./graphql-request";
import { AppContext } from "pages/_app";

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

function useData<T>(cacheKey: string, fetcher: () => Promise<T>) {
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

function useQuery<T>(
  cacheKey: string,
  document: DocumentNode,
  variables?: object
) {
  const { cookieHeader } = useContext(AppContext);
  return useData<T>(cacheKey, () =>
    request<T>(document, variables, { cookie: cookieHeader })
  );
}

function useMutation<T>(document: DocumentNode) {
  const [resource, setResource] = useState<{ read: () => T } | null>(null);
  const [isPending, startTransition] = useTransition({
    timeoutMs: 5000,
  }) as [boolean, any];

  const execMutation = (variables: object) => {
    const promise = request<T>(document, variables);

    startTransition(() => {
      setResource(suspenseWrapPromise(promise));
    });

    return promise;
  };

  return [
    execMutation,
    { data: resource ? resource.read() : null, isPending },
  ] as [
    (variables: object) => Promise<T>,
    { data: null | T; isPending: boolean }
  ];
}

export { useData, useQuery, useMutation, gql };
