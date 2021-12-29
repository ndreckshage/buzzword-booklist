import { query as Q } from "faunadb";

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
  return Q.Let(
    {
      doc: Q.Get(Q.Match(Q.Index(docIndex), docIndexTerms)),
      edgeRef: Q.Select(
        "ref",
        Q.Get(Q.Match(Q.Index(edgeIndex), edgeIndexTerms))
      ),
    },
    Q.Update(Q.Select("ref", Q.Var("doc")), {
      data: {
        [docEdgeRefName]: Q.Difference(
          Q.Select(["data", docEdgeRefName], Q.Var("doc")),
          [Q.Var("edgeRef")]
        ),
      },
    })
  );
}
