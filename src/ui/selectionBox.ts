import { Item } from "../core";
import { div } from "../platform";

export let selectedItem: Item;
const selectionBox = div({ class: "selection-box" });
document.body.insertAdjacentElement("afterbegin", selectionBox);

export function selectItem(item: Item) {
  selectedItem = item;
  const selectedDiv = document.getElementById(selectedItem.id);
  if (selectedDiv) {
    const rect = selectedDiv.getBoundingClientRect();
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    selectionBox.style.top = rect.top + scrollY + "px";
    selectionBox.style.height = rect.height + "px";
  }
}
