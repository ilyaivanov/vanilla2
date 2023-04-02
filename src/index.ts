import { tree } from "./core/initialState";
import {
  Item,
  appendItemAfter,
  getItemAbove,
  getItemBelow,
  isRoot,
  item,
  removeItem,
} from "./core/tree";
import {
  closeItem,
  createApp,
  itemAddedAt,
  openItem,
  removeItemFromDom,
} from "./ui/ui";
import {
  isEditing,
  selectItem,
  selectedItem,
  startEdit,
  stopEdit,
} from "./ui/selectionBox";

document.body.appendChild(createApp());

window.addEventListener("keydown", (e) => {
  if (isEditing) {
    if (e.code === "Enter" || e.code === "Escape") {
      stopEdit();
      e.preventDefault();
    }

    return;
  }

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
  } else if (e.code === "KeyE") {
    startEdit();
    e.preventDefault();
  } else if (e.code === "KeyX") {
    const nextItem = removeItem(selectedItem);
    removeItemFromDom(selectedItem);
    selectItem(nextItem);
    e.preventDefault();
  } else if (e.code === "Enter") {
    const newItem: Item = item("");
    const newIndex = appendItemAfter(selectedItem, newItem);
    itemAddedAt(selectedItem.parent!, newIndex);
    selectItem(newItem);
    startEdit();

    //calling select second time to adujust properly borders of the selection box
    //empty text created a smaller height
    selectItem(newItem);
    e.preventDefault();
  }
});

selectItem(tree.root.children[0]);
