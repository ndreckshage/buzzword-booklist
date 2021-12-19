async function fetchGraphQL<V>(text: string, variables: V) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
        ? "http://"
        : "https://"
    }${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: text,
        variables,
      }),
    }
  );

  return await response.json();
}

export default fetchGraphQL;
