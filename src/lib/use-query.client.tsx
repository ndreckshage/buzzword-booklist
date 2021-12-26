import { useState } from "react";

const queryCache: any = {};

const useQuery = (cacheKey: string, fetcher: any) => {
  const [updateCount, forceUpdate] = useState(0);
  const initialRender = updateCount === 0;

  if (!queryCache[cacheKey]) {
    let promise: any = null;
    let promiseData: any =
      typeof window !== "undefined" && initialRender
        ? window.queryData?.[cacheKey] ?? undefined
        : undefined;

    queryCache[cacheKey] = () => {
      if (promiseData !== undefined) return promiseData;
      if (!promise) promise = fetcher().then((r: any) => (promiseData = r));
      throw promise;
    };
  }

  const data = queryCache[cacheKey]();

  return {
    data,
    refetch: () => {
      queryCache[cacheKey] = null;
      forceUpdate((x) => x + 1);
    },
    hydrateClient: initialRender && (
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

export default useQuery;
