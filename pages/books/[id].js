import { gql } from "graphql-request";
import {
  Container,
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Divider,
} from "@chakra-ui/react";
import createGqlClient from "../../lib/create-gql-client";
import Image from "next/image";
import NextLink from "next/link";

export async function getServerSideProps({ params }) {
  const graphQLClient = createGqlClient();
  const data = await graphQLClient.request(
    gql`
      query GetBook($id: ID!) {
        findBookByID(id: $id) {
          _id
          title
          image
          bookshopLink
          description
          author {
            name
          }
        }
      }
    `,
    { id: params.id }
  );

  return {
    props: { book: data.findBookByID },
  };
}

const BOOK_WIDTH = 200;

export default function Book({ book }) {
  if (!book) {
    return (
      <Container>
        <Heading margin="50px 0" size="md">
          Book not found :(
        </Heading>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" align="center" margin="10px 0" spacing="30px">
        <Image src={book.image} width={BOOK_WIDTH} height={BOOK_WIDTH * 1.5} />
        <Box>
          <Heading size="md" marginBottom="10px">
            {book.title}
          </Heading>
          <Heading size="xs">{book.author.name}</Heading>
          <Divider margin="20px 0" />
          <NextLink href={book.bookshopLink}>
            <Button>Buy Now!</Button>
          </NextLink>
        </Box>
      </Stack>
      <Divider margin="20px 0" />
      <Text>{book.description}</Text>
    </Container>
  );
}
