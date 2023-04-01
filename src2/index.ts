import { div, fragment, img } from "../src/platform";
import { tree } from "../src/core/initialState";
import { Item, getItemAbove, getItemBelow, isRoot } from "../src/core/tree";
import "./index.scss";

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
  return div({
    id: "c" + item.id,
    class: {
      children: true,
      "folder-channel-image": item.type === "folder",
      "channel-children": item.type === "channel",
      "video-children": item.type === "video",
    },
    children: item.children.map(renderItem),
  });
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
let selectedItem = tree.root.children[1];
const selectionBox = div({ class: "selection-box" });
document.body.insertAdjacentElement("afterbegin", selectionBox);

function selectItem(item: Item) {
  selectedItem = item;
  const selectedDiv = document.getElementById(selectedItem.id);
  if (selectedDiv) {
    const rect = selectedDiv.getBoundingClientRect();
    selectionBox.style.top = selectedDiv.offsetTop + "px";
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
