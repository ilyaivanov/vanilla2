import { tree } from "./core/initialState";
import { getItemAbove, getItemBelow, isRoot } from "./core/tree";
import { closeItem, createApp, openItem } from "./ui/ui";
import { selectItem, selectedItem } from "./ui/selectionBox";

document.body.appendChild(createApp());

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

selectItem(tree.root.children[0]);
