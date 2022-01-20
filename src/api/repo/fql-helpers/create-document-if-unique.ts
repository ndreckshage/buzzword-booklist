import { query as q } from "faunadb";

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
  return q.Let(
    { sourceMatch: q.Match(q.Index(index), indexTerms) },
    q.If(
      q.Exists(q.Var("sourceMatch")),
      null,
      q.Create(collectionName, { data: documentData })
    )
  );
}
