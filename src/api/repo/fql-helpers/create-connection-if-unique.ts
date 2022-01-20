import { query as q } from "faunadb";

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
  return q.Let(
    {
      edgeARef: q.Select(
        ["ref"],
        q.Get(q.Match(q.Index(edgeAIndex), edgeAIndexTerms))
      ),
      edgeBRef: q.Select(
        ["ref"],
        q.Get(q.Match(q.Index(edgeBIndex), edgeBIndexTerms))
      ),
    },
    q.Let(
      {
        connectionMatch: q.Match(q.Index(connectionRefIndex), [
          q.Var("edgeARef"),
          q.Var("edgeBRef"),
        ]),
      },
      q.If(
        q.Exists(q.Var("connectionMatch")),
        null,
        q.Create(connectionCollectionName, {
          data: {
            [edgeAName]: q.Var("edgeARef"),
            [edgeBName]: q.Var("edgeBRef"),
          },
        })
      )
    )
  );
}
