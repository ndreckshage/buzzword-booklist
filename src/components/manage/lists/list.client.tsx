const A = (props) => {
  const a = useQuery(
    "something",
    () =>
      request(
        gql`
          query GetList($listSlug: String!) {
            list(listSlug: $listSlug) {
              title
              books {
                edges {
                  node {
                    title
                    googleBooksVolumeId
                    image
                  }
                }
              }
            }
          }
        `,
        { listSlug: "nicks-list" }
      ).then(({ list }) => list),
    {
      suspense: true,
    }
  );

  console.log("a", a.data);

  // console.log("a", props);
  // const x = props.resource.read();
  // console.log("x", props);
  // return <p>{x.title}</p>;
  return <p>{a.data.title}</p>;
};

export default A;
