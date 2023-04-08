import { div } from "./platform";
import { tree } from "./core/initialState";
import { Item } from "./core/tree";
import { selectItem } from "./ui/selectionBox";
import { ids } from "./ui/htmlEffects";

import "./input.ts";
import "./ui/scrolls.scss";
import "./index.scss";

export function viewItem(item: Item) {
  return div({
    id: ids.container(item),
    children: [
      div({
        id: ids.item(item),
        class: "item",
        children: [
          div({
            class: { icon: true, "icon-empty": item.children.length === 0 },
          }),
          div({
            id: ids.text(item),
            class: "item-text",
            children: item.title,
          }),
          //
        ],
      }),
      item.isOpen && viewChildren(item),
    ],
  });
}

export function viewChildren(item: Item): HTMLElement {
  return div({
    id: ids.children(item),
    class: "children",
    children: item.children.map(viewItem),
  });
}

document.body.appendChild(
  div({
    class: "page",
    children: viewChildren(tree.root),
  })
);

selectItem(tree.root.children[0]);
