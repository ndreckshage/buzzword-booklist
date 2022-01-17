import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}