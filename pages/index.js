import { gql } from "graphql-request";
import { Container, Stack, Box, Heading, Text, Link } from "@chakra-ui/react";
import createGqlClient from "../lib/create-gql-client";
import Image from "next/image";
import NextLink from "next/link";

export async function getServerSideProps() {
  const graphQLClient = createGqlClient();
  const data = await graphQLClient.request(
    gql`
      query GetAuthorsAndBooks {
        authors {
          data {
            _id
            name
            books {
              data {
                _id
                title
                image
              }
            }
          }
        }
      }
    `
  );

  return {
    props: { authors: data.authors },
  };
}

const BOOK_WIDTH = 100;

export default function Home({ authors }) {
  return (
    <Container>
      {authors.data.map((author) => (
        <Stack key={author._id} direction="column" margin="20px 0">
          <Box>
            <Heading size="md">{author.name}</Heading>
            {author.books.data.map((book) => (
              <Stack
                key={book._id}
                direction="row"
                align="center"
                margin="10px 0"
              >
                <Image
                  src={book.image}
                  width={BOOK_WIDTH}
                  height={BOOK_WIDTH * 1.5}
                />
                <Box>
                  <Text>{book.title}</Text>
                  <NextLink href={`/books/${book._id}`}>
                    <Link>View Details</Link>
                  </NextLink>
                </Box>
              </Stack>
            ))}
          </Box>
        </Stack>
      ))}
    </Container>
  );
}
