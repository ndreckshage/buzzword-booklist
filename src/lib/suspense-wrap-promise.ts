export type SuspenseWrapPromise<T> = { read(): T };

// Referenced from here: https://codesandbox.io/s/infallible-feather-xjtbu?file=/src/fakeApi.js:670-674
// https://reactjs.org/docs/concurrent-mode-patterns.html
export default function suspenseWrapPromise<P>(promise: Promise<P>) {
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
