import { request, gql } from "./graphql-request";
import { DocumentNode } from "graphql";

const queryCache: any = {};

const useData = <T>(cacheKeyBase: string, fetcher: () => Promise<T>) => {
  const fiveSecondCachebuster = Math.floor(Date.now() / 5000);
  const cacheKey = `${cacheKeyBase}::${fiveSecondCachebuster}`;

  if (!queryCache[cacheKey]) {
    let promise: any = null;
    let promiseData: any = undefined;

    queryCache[cacheKey] = () => {
      if (promiseData !== undefined) return promiseData;
      if (!promise) promise = fetcher().then((r: any) => (promiseData = r));
      throw promise;
    };
  }

  return queryCache[cacheKey]() as T;
};

function useQuery<T>(
  cacheKey: string,
  document: DocumentNode,
  variables?: object
) {
  // @NOTE NO CONTEXT ACCESS!!!! NO ABILITY TO GET PERSONALIZED RESULTS
  return useData<T>(cacheKey, () => request<T>(document, variables));
}

export { useData, useQuery, gql };
