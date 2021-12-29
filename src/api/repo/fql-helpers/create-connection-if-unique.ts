import { query as Q } from "faunadb";

export default function createConnectionIfUnique({
  edgeAName,
  edgeBName,
  edgeAIndex,
  edgeAIndexTerms,
  edgeBIndex,
  edgeBIndexTerms,
  connectionRefIndex,
  connectionCollectionName,
}: {
  edgeAName: string;
  edgeBName: string;
  edgeAIndex: string;
  edgeAIndexTerms: string[];
  edgeBIndex: string;
  edgeBIndexTerms: string[];
  connectionRefIndex: string;
  connectionCollectionName: string;
}) {
  return Q.Let(
    {
      edgeARef: Q.Select(
        ["ref"],
        Q.Get(Q.Match(Q.Index(edgeAIndex), edgeAIndexTerms))
      ),
      edgeBRef: Q.Select(
        ["ref"],
        Q.Get(Q.Match(Q.Index(edgeBIndex), edgeBIndexTerms))
      ),
    },
    Q.Let(
      {
        connectionMatch: Q.Match(Q.Index(connectionRefIndex), [
          Q.Var("edgeARef"),
          Q.Var("edgeBRef"),
        ]),
      },
      Q.If(
        Q.Exists(Q.Var("connectionMatch")),
        null,
        Q.Create(connectionCollectionName, {
          data: {
            [edgeAName]: Q.Var("edgeARef"),
            [edgeBName]: Q.Var("edgeBRef"),
          },
        })
      )
    )
  );
}
