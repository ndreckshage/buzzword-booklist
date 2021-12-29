import { query as Q } from "faunadb";

export default function createDocumentIfUnique({
  index,
  indexTerms,
  collectionName,
  documentData,
}: {
  index: string;
  indexTerms: string[];
  collectionName: string;
  documentData: Object;
}) {
  return Q.Let(
    { sourceMatch: Q.Match(Q.Index(index), indexTerms) },
    Q.If(
      Q.Exists(Q.Var("sourceMatch")),
      null,
      Q.Create(collectionName, { data: documentData })
    )
  );
}
