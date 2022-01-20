import { query as q } from "faunadb";

export default function appendConnectionToDocumentIfUnique({
  docIndex,
  docIndexTerms,
  docEdgeRefName,
  edgeIndex,
  edgeIndexTerms,
}: {
  docIndex: string;
  docIndexTerms: string[];
  docEdgeRefName: string;
  edgeIndex: string;
  edgeIndexTerms: string[];
}) {
  return q.Let(
    {
      doc: q.Get(q.Match(q.Index(docIndex), docIndexTerms)),
      edgeRef: q.Select(
        "ref",
        q.Get(q.Match(q.Index(edgeIndex), edgeIndexTerms))
      ),
    },
    q.Update(q.Select("ref", q.Var("doc")), {
      data: {
        [docEdgeRefName]: q.Distinct(
          q.Append(
            q.Var("edgeRef"),
            q.Select(["data", docEdgeRefName], q.Var("doc"))
          )
        ),
      },
    })
  );
}
