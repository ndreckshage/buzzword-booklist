const queryCache: any = {};

const useData = (cacheKey: string, fetcher: any) => {
  if (!queryCache[cacheKey]) {
    let promise: any = null;
    let promiseData: any = undefined;

    queryCache[cacheKey] = () => {
      if (promiseData !== undefined) return promiseData;
      if (!promise) promise = fetcher().then((r: any) => (promiseData = r));
      throw promise;
    };
  }

  const data = queryCache[cacheKey]();

  return {
    data,
  };
};

export default useData;
