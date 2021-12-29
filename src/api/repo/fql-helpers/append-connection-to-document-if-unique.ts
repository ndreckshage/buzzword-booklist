import { query as Q } from "faunadb";

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
        [docEdgeRefName]: Q.Distinct(
          Q.Append(
            Q.Var("edgeRef"),
            Q.Select(["data", docEdgeRefName], Q.Var("doc"))
          )
        ),
      },
    })
  );
}
