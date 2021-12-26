function suspenseWrapPromise<P>(promise: Promise<P>) {
  let status = "pending";
  let result: P;

  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      }

      return result;
    },
  };
}

export default suspenseWrapPromise;
