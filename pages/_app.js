import {
  ChakraProvider,
  Heading,
  Stack,
  Container,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Container>
        <Heading margin="10px 0">Bookshop Demo</Heading>
        <Stack direction="row" spacing="5px">
          <NextLink href="/">
            <Link>Home</Link>
          </NextLink>
          <NextLink href="/blog">
            <Link>Blog</Link>
          </NextLink>
        </Stack>
      </Container>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
