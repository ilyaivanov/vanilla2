//
// HTML effects

import { viewChildren, viewItem } from "..";
import { removeItem } from "../core";
import { Item } from "../core";
import {
  animationFinidhed as animationFinished,
  animationStarted,
} from "./selectionBox";

export function closeItem(item: Item) {
  item.isOpen = false;
  const children = ids.getChildren(item)!;
  if (!revertAnimations(children))
    animateHeight(item, children, children.clientHeight, 0);
}

export function openItem(item: Item) {
  item.isOpen = true;

  const existingChildren = ids.getChildren(item);
  if (existingChildren && revertAnimations(existingChildren)) return;

  const children = viewChildren(item);
  ids.getItem(item)?.insertAdjacentElement("afterend", children);
  animateHeight(item, children, 0, children.clientHeight);
}

export function removeItemFromDom(item: Item) {
  ids.getContainer(item)?.remove();
}

export function itemAddedAt(parent: Item, index: number) {
  const childrenElem = ids.getChildren(parent);
  const newNode = viewItem(parent.children[index]);
  childrenElem?.insertBefore(newNode, childrenElem.children[index]);

  //TODO: animate
}

export function moveItemRight(selectedItem: Item) {
  const parent = selectedItem.parent;
  const itemContainer = ids.getContainer(selectedItem);
  if (parent && itemContainer) {
    removeItem(selectedItem);
  }
}

export function moveItemLeft(selectedItem: Item) {
  const itemContainer = ids.getContainer(selectedItem);
  const parent = selectedItem.parent;
  if (parent && itemContainer) {
    // const index = parent.children.indexOf(selectedItem);

    removeItem(selectedItem);
    itemContainer.remove();

    ids.getContainer(parent)?.insertAdjacentElement("afterend", itemContainer);
  }
}

//
// ids
export const ids = {
  children: (item: Item) => "c" + item.id,
  getChildren: (item: Item) => document.getElementById(ids.children(item)),

  text: (item: Item) => "text-" + item.id,
  getText: (item: Item) => document.getElementById(ids.text(item)),

  container: (item: Item) => "container-" + item.id,
  getContainer: (item: Item) => document.getElementById(ids.container(item)),

  item: (item: Item) => item.id,
  getItem: (item: Item) => document.getElementById(ids.item(item)),
};

//
//
//
// animations
function animateHeight(
  item: Item,
  elem: HTMLElement,
  from: number,
  to: number
) {
  animationStarted();
  elem.style.overflowY = "hidden";
  elem
    .animate([{ height: from + "px" }, { height: to + "px" }], {
      duration: Math.max(200, Math.abs(to - from) / 2),
      easing: "ease-in-out",
    })
    .addEventListener("finish", () => {
      elem.style.removeProperty("overflow-y");
      if (!item.isOpen) elem.remove();
      animationFinished();
    });
}

function revertAnimations(elem: HTMLElement): boolean {
  const animations = elem.getAnimations();
  console.log(animations.length);
  if (animations.length == 0) return false;

  for (let i = 0; i < animations.length; i += 1) {
    animations[i].reverse();
  }
  return true;
}
