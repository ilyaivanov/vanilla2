import { div, span } from "./platform";
import { tree, Item } from "./core";
import "./index.scss";
import "./app.scss";
import "./levels.scss";

function renderChildren(item: Item, level: number): Node {
  if (!item.isOpen) return document.createDocumentFragment();
  else
    return div({
      class: {
        children: true,
        board: item.view === "board",
        ["board-" + level]: item.view === "board",
      },
      children: item.children.map((i) =>
        render(i, item.view === "board" ? 0 : level)
      ),
    });
}

function render(item: Item, level: number): HTMLElement {
  return div({
    children: [
      div({
        class: "item level-" + level,
        children: [
          span({ class: { circle: true, empty: item.children.length == 0 } }),
          item.title,
        ],
      }),

      renderChildren(item, level + 1),
    ],
  });
}

function createApp() {
  return div({
    children: tree.root.children.map((i) => render(i, 0)),
  });
}

document.body.appendChild(createApp());
