import NextApp, {
  type AppProps as NextAppProps,
  AppContext as NextAppContext,
} from "next/app";

import { useRouter } from "next/router";
import { Suspense, createContext, useEffect, useState } from "react";
import CurrentUserProvider from "ui/components/app/current-user-provider";
import Header from "ui/components/app/header";
import Footer from "ui/components/app/footer";
import cx from "classnames";
import "ui/styles/global.css";

export const AppContext = createContext({ cookieHeader: "" });

interface AppProps extends NextAppProps {
  cookieHeader: "";
}

function App({ Component, pageProps, cookieHeader }: AppProps) {
  const router = useRouter();
  const [routeTransition, setRouteTransition] = useState(false);

  useEffect(() => {
    const routeTransitionOn = () => setRouteTransition(true);
    const routeTransitionOff = () => setRouteTransition(false);

    router.events.on("routeChangeStart", routeTransitionOn);
    router.events.on("routeChangeComplete", routeTransitionOff);

    return () => {
      router.events.off("routeChangeStart", routeTransitionOn);
      router.events.off("routeChangeComplete", routeTransitionOff);
    };
  }, []);

  return (
    <AppContext.Provider value={{ cookieHeader }}>
      <Header />
      <div
        className={cx("transition-opacity", {
          "opacity-100": !routeTransition,
          "opacity-50": routeTransition,
        })}
      >
        <Suspense
          fallback={<div className="container mx-auto my-10">Loading..</div>}
        >
          {router.asPath.startsWith("/manage") ? (
            <CurrentUserProvider>
              {(currentUser) =>
                currentUser ? (
                  <Component {...pageProps} cookieHeader={cookieHeader} />
                ) : (
                  <p>Not authorized</p>
                )
              }
            </CurrentUserProvider>
          ) : (
            <Component {...pageProps} cookieHeader={cookieHeader} />
          )}
        </Suspense>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}

App.getInitialProps = async (appContext: NextAppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    cookieHeader:
      typeof window === "undefined"
        ? appContext.ctx.req?.headers.cookie ?? null
        : null,
  };
};

export default App;
