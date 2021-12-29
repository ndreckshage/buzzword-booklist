export type ComponentModel = { id: string; componentType: string };

export type LayoutModel = ComponentModel & { componentRefs: string[] };

export { default as getComponentsByIds } from "./get-components-by-ids";
export { default as getLayoutComponentsByIds } from "./get-layout-components-by-ids";
