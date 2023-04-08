import { div, fragment, img } from "../platform";
import { tree } from "../core/initialState";
import { Item } from "../core/tree";

import "./ui.scss";
import "./scrolls.scss";

function renderItem(item: Item): Node {
  return div({
    id: "container-" + item.id,
    children: [
      div({
        id: item.id,
        class: {
          item: true,
          "item-with-image": !!item.imageUrl,
        },
        children: [
          item.imageUrl
            ? img({
                class: {
                  "item-channel-image": item.type === "channel",
                  "item-video-image": item.type === "video",
                },
                src: item.imageUrl,
              })
            : div({
                class: {
                  "item-icon": true,
                  "item-icon-full": item.children.length > 0,
                },
              }),
          div({
            id: "text-" + item.id,
            class: "item-text",
            children: [item.title],
          }),
        ],
      }),
      item.isOpen && renderChildren(item),
    ],
  });
}
function renderChildren(item: Item) {
  const children =
    item.view === "board"
      ? item.children.map((i) =>
          fragment([
            div({ class: "board-cell", children: [renderItem(i)] }),
            div({ class: "board-splitter" }),
          ])
        )
      : item.children.map(renderItem);
  const res = div({
    children,
    id: "c" + item.id,
    class: {
      children: true,
      board: item.view == "board",
      "scroll-container": item.view == "board",
      "folder-children": item.type === "folder",
      "channel-children": item.type === "channel",
      "video-children": item.type === "video",
    },
  });

  return res;
}

export function createApp() {
  return div({
    class: "page",
    id: "c" + tree.root.id,
    children: tree.root.children.map(renderItem),
  });
}

//
// HTML effects
//
export function closeItem(item: Item) {
  item.isOpen = false;
  document.getElementById("c" + item.id)?.remove();
}

export function openItem(item: Item) {
  item.isOpen = true;
  document
    .getElementById(item.id)
    ?.insertAdjacentElement("afterend", renderChildren(item));
}

export function removeItemFromDom(item: Item) {
  document.getElementById("container-" + item.id)?.remove();
}

export function itemAddedAt(parent: Item, index: number) {
  const childrenElem = document.getElementById("c" + parent.id);
  const newNode = renderItem(parent.children[index]);
  childrenElem?.insertBefore(newNode, childrenElem.children[index]);
}
