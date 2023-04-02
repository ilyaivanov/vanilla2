import { div, fragment, img } from "../platform";
import { tree } from "../core/initialState";
import { Item, getItemAbove, getItemBelow, isRoot } from "../core/tree";

import "./ui.scss";
import "./scrolls.scss";

type ExpandedElement = {
  originalPadding: number;
  element: HTMLElement;
};
const boards: ExpandedElement[] = [];
function createBoard(element: HTMLElement) {
  let originalPadding = 0;
  let left = 0;
  // this is ugly, I need to come back to this code later
  function assignStyles() {
    //   // i don't need to get left on each resize
    //   // this will make a flashing position of an element
    left = element.getBoundingClientRect().left;
    element.style.transform = `translateX(-${left}px)`;
    element.style.paddingLeft = left + 20 + "px";
  }
  requestAnimationFrame(() => {
    boards.push({ element, originalPadding });
    assignStyles();
  });
}

function renderItem(item: Item): Node {
  return fragment([
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
  ]);
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

  if (item.view === "board") createBoard(res);
  return res;
}

export function createApp() {
  return div({
    class: "page",
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
