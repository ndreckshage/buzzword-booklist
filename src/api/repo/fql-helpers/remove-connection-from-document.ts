import { query as q } from "faunadb";

export default function removeConnectionFromDocument({
  docIndex,
  docIndexTerms,
  edgeIndex,
  edgeIndexTerms,
  docEdgeRefName,
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
        [docEdgeRefName]: q.Difference(
          q.Select(["data", docEdgeRefName], q.Var("doc")),
          [q.Var("edgeRef")]
        ),
      },
    })
  );
}
