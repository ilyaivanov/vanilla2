import { div, fragment, img } from "./platform";
import { tree } from "./core/initialState";
import { Item, getItemAbove, getItemBelow, isRoot } from "./core/tree";
import "./index.scss";
import "./scrolls.scss";

type ExpandedElement = {
  originalPadding: number;
  element: HTMLElement;
};
const boards: ExpandedElement[] = [];
function createBoard(element: HTMLElement) {
  let originalPadding = 0;
  let origianl = 0;
  let left = 0;
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

  // window.addEventListener("resize", assignStyles);
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
        item.title,
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

const app = div({
  class: "page",
  children: tree.root.children.map(renderItem),
});

document.body.appendChild(app);

//
// HTML effects
//
function closeItem(item: Item) {
  item.isOpen = false;
  document.getElementById("c" + item.id)?.remove();
}

function openItem(item: Item) {
  item.isOpen = true;
  document
    .getElementById(item.id)
    ?.insertAdjacentElement("afterend", renderChildren(item));
}

//
//
//
//
// Selection
let selectedItem = tree.root.children[0];
const selectionBox = div({ class: "selection-box" });
document.body.insertAdjacentElement("afterbegin", selectionBox);

function selectItem(item: Item) {
  selectedItem = item;
  const selectedDiv = document.getElementById(selectedItem.id);
  if (selectedDiv) {
    const rect = selectedDiv.getBoundingClientRect();
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    selectionBox.style.top = rect.top + scrollY + "px";
    selectionBox.style.height = rect.height + "px";
  }
}

selectItem(selectedItem);

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    const nextItem = getItemBelow(tree.root, selectedItem);
    if (nextItem) selectItem(nextItem);
    e.preventDefault();
  } else if (e.code === "ArrowUp") {
    const nextItem = getItemAbove(selectedItem);
    if (nextItem) selectItem(nextItem);
    e.preventDefault();
  } else if (e.code === "ArrowLeft") {
    if (selectedItem.isOpen) closeItem(selectedItem);
    else if (selectedItem.parent && !isRoot(selectedItem.parent))
      selectItem(selectedItem.parent);
  } else if (e.code === "ArrowRight") {
    if (!selectedItem.isOpen) openItem(selectedItem);
    else if (selectedItem.children.length > 0)
      selectItem(selectedItem.children[0]);
  }
});
