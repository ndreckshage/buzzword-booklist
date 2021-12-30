import NextApp, {
  type AppProps as NextAppProps,
  AppContext as NextAppContext,
} from "next/app";

import { Suspense, createContext, type ReactNode } from "react";
import Link from "ui/components/common/link.client";
import AuthButton from "ui/components/app/auth-button.client";
import { useQuery, gql } from "ui/lib/use-data.client";
import { type Maybe } from "api/__generated__/resolvers-types";
import "ui/styles/global.css";

export const AppContext = createContext({ cookieHeader: "" });

interface AppProps extends NextAppProps {
  cookieHeader: "";
}

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      name
    }
  }
`;

const CurrentUserProvider = (props: {
  children: (currentUser: string | null) => ReactNode;
}) => {
  const { data, hydrateClient } = useQuery<{
    currentUser: Maybe<{ name: string }>;
  }>("currentUserAppProvider", CURRENT_USER_QUERY);

  return (
    <>
      {props.children(data.currentUser?.name ?? null)}
      {hydrateClient}
    </>
  );
};

function App({ Component, pageProps, cookieHeader, router }: AppProps) {
  return (
    <>
      <AppContext.Provider value={{ cookieHeader }}>
        <h1 className="text-3xl font-bold text-emerald-400 p-10">
          Buzzword Bookshop!
        </h1>
        <div className="m-5 p-5 space-x-4">
          <Link href="/">Homepage</Link>
          <Link href="/demos">Demos</Link>
          <Suspense fallback={null}>
            <CurrentUserProvider>
              {(currentUser) => (
                <>
                  {currentUser && (
                    <>
                      <Link href="/manage/layouts">Manage Layouts</Link>
                      <Link href="/manage/lists">Manage Lists</Link>
                    </>
                  )}
                  <AuthButton currentUser={currentUser} />
                </>
              )}
            </CurrentUserProvider>
          </Suspense>
        </div>
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
      </AppContext.Provider>
    </>
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
