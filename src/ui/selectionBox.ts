import { Item } from "../core";
import { div } from "../platform";

import "./selectionBox.scss";

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

export let isEditing = false;
let editingText: HTMLElement | undefined;
export function startEdit() {
  isEditing = true;
  editingText = document.getElementById("text-" + selectedItem.id) || undefined;

  if (editingText) {
    editingText.contentEditable = "true";
    editingText.focus();
    var range = document.createRange();
    range.setStart(editingText, 0);
    range.collapse(true);

    var selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    editingText.addEventListener("input", () => {
      if (editingText) selectedItem.title = editingText.innerText;
    });

    editingText.addEventListener("blur", onBlur);
  }
}

export function stopEdit() {
  if (editingText) {
    editingText.removeEventListener("blur", onBlur);
    editingText.blur();
  }
  isEditing = false;
}

function onBlur() {
  stopEdit();
}
