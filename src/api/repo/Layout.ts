import { Client, query as Q } from "faunadb";
import { ComponentQuery } from "./Component";

export type LayoutQuery = {
  id: string;
  key: string;
  components: ComponentQuery[];
};

export const getLayouts =
  (client: Client) => async (keys: readonly string[]) => {
    const x = await client.query(
      Q.Map(
        keys,
        Q.Lambda(
          "key",
          Q.Let(
            {
              layoutDoc: Q.Get(
                Q.Match(Q.Index("unique_layouts_by_key"), Q.Var("key"))
              ),
            },
            Q.Let(
              {
                layoutRef: Q.Select("ref", Q.Var("layoutDoc")),
              },
              Q.Let(
                {
                  layoutComponentMatch: Q.Match(
                    Q.Index("layout_component_connections_by_layout_ref"),
                    Q.Var("layoutRef")
                  ),
                  layoutLayoutMatch: Q.Match(
                    Q.Index("layout_layout_connections_by_parent_layout_ref"),
                    Q.Var("layoutRef")
                  ),
                },
                Q.Let(
                  {
                    layouts: Q.Select(
                      "data",
                      Q.Map(
                        Q.Paginate(Q.Var("layoutLayoutMatch")),
                        Q.Lambda(
                          "layoutLayoutConnection",
                          Q.Let(
                            {
                              childLayoutRef: Q.Get(
                                Q.Select(
                                  ["data", "childLayoutRef"],
                                  Q.Get(Q.Var("layoutLayoutConnection"))
                                )
                              ),
                            },
                            {
                              id: Q.Select(
                                ["ref", "id"],
                                Q.Var("childLayoutRef")
                              ),
                              key: Q.Select(
                                ["data", "key"],
                                Q.Var("childLayoutRef")
                              ),
                              componentType: "Layout",
                            }
                          )
                        )
                      )
                    ),
                    components: Q.Select(
                      "data",
                      Q.Map(
                        Q.Paginate(Q.Var("layoutComponentMatch")),
                        Q.Lambda(
                          "layoutComponentConnection",
                          Q.Let(
                            {
                              componentRef: Q.Get(
                                Q.Select(
                                  ["data", "componentRef"],
                                  Q.Get(Q.Var("layoutComponentConnection"))
                                )
                              ),
                            },
                            {
                              id: Q.Select(
                                ["ref", "id"],
                                Q.Var("componentRef")
                              ),
                              componentType: Q.Select(
                                ["data", "componentType"],
                                Q.Var("componentRef")
                              ),
                            }
                          )
                        )
                      )
                    ),
                  },
                  {
                    id: Q.Select("id", Q.Var("layoutRef")),
                    key: Q.Select(["data", "key"], Q.Var("layoutDoc")),
                    components: Q.Prepend(
                      Q.Var("layouts"),
                      Q.Var("components")
                    ),
                  }
                )
              )
            )
          )
        )
      )
    );

    return x as Promise<LayoutQuery[]>;
  };
