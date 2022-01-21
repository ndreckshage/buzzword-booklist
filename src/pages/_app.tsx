import NextApp, {
  type AppProps as NextAppProps,
  AppContext as NextAppContext,
} from "next/app";

import { Suspense, createContext } from "react";
import CurrentUserProvider from "ui/components/app/current-user-provider";
import Header from "ui/components/app/header";
import Footer from "ui/components/app/footer";
import "ui/styles/global.css";

export const AppContext = createContext({ cookieHeader: "" });

interface AppProps extends NextAppProps {
  cookieHeader: "";
}

function App({ Component, pageProps, cookieHeader, router }: AppProps) {
  return (
    <div className="">
      <AppContext.Provider value={{ cookieHeader }}>
        <Header />
        <Suspense fallback="Loading...">
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
      </AppContext.Provider>
    </div>
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
