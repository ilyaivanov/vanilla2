//
// HTML effects

import { viewChildren, viewItem } from "..";
import { Item } from "../core";

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

//
// ids
export const ids = {
  children: (item: Item) => "c" + item.id,
  getChildren: (item: Item) => document.getElementById("c" + item.id),

  text: (item: Item) => "text-" + item.id,
  getText: (item: Item) => document.getElementById(ids.text(item)),

  container: (item: Item) => "container-" + item.id,
  getContainer: (item: Item) => document.getElementById("container-" + item.id),

  item: (item: Item) => item.id,
  getItem: (item: Item) => document.getElementById(item.id),
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
  elem.style.overflowY = "hidden";
  elem
    .animate([{ height: from + "px" }, { height: to + "px" }], {
      duration: Math.max(200, Math.abs(to - from) / 2),
      easing: "ease-in-out",
    })
    .addEventListener("finish", () => {
      elem.style.removeProperty("overflow-y");
      if (!item.isOpen) elem.remove();
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
