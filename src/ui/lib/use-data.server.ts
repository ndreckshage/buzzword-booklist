import { request, gql } from "./graphql-request";
import { DocumentNode } from "graphql";

const queryCache: any = {};
const useData = <T>(cacheKey: string, fetcher: () => Promise<T>) => {
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
