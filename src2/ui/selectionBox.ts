import type { Item } from "../core";
import { div } from "../platform";
import { ids } from "./htmlEffects";

import "./selectionBox.scss";

export let selectedItem: Item;
const selectionBox = div({ class: "selection-box" });
document.body.insertAdjacentElement("afterbegin", selectionBox);

let selectedItemElement: HTMLElement | null;
export function selectItem(item: Item) {
  selectedItem = item;
  selectedItemElement = ids.getItem(selectedItem);
  updatePosition();
}

function updatePosition() {
  if (selectedItemElement) {
    const rect = selectedItemElement.getBoundingClientRect();
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    selectionBox.style.top = rect.top + scrollY + "px";
    selectionBox.style.height = rect.height + "px";
  }
}

function onTick() {
  updatePosition();
  console.log("tick");
  if (runningAnimations > 0) requestAnimationFrame(onTick);
}

let runningAnimations = 0;
export function animationStarted() {
  if (runningAnimations == 0) requestAnimationFrame(onTick);

  runningAnimations += 1;
}

export function animationFinidhed() {
  runningAnimations -= 1;
}

export let isEditing = false;
let editingText: HTMLElement | undefined;
export function startEdit() {
  isEditing = true;
  editingText = ids.getText(selectedItem) || undefined;

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
      if (editingText) {
        selectedItem.title = editingText.innerText;
        if (editingText.innerText.length == 0) editingText.innerHTML = "&nbsp;";
      }
    });

    editingText.addEventListener("blur", onBlur);
  }
}

export function stopEdit() {
  if (editingText) {
    editingText.removeAttribute("contenteditable");
    editingText.removeEventListener("blur", onBlur);
    editingText.blur();
  }
  isEditing = false;
}

function onBlur() {
  stopEdit();
}
