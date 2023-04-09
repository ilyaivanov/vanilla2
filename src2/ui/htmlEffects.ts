//
// HTML effects

import { viewChildren, viewItem } from "..";
import { Item } from "../core";

export function closeItem(item: Item) {
  item.isOpen = false;
  const children = ids.getChildren(item)!;

  collapse(children);
}

export function openItem(item: Item) {
  item.isOpen = true;
  const children = viewChildren(item);
  ids.getItem(item)?.insertAdjacentElement("afterend", children);
  expand(children);
}

export function removeItemFromDom(item: Item) {
  ids.getContainer(item)?.remove();
}

export function itemAddedAt(parent: Item, index: number) {
  const childrenElem = ids.getChildren(parent);
  const newNode = viewItem(parent.children[index]);
  childrenElem?.insertBefore(newNode, childrenElem.children[index]);
}

//
// ids
export const ids = {
  children: (item: Item) => "c" + item.id,
  getChildren: (item: Item) => document.getElementById("c" + item.id),

  text: (item: Item) => "text-" + item.id,
  getText: (item: Item) => document.getElementById("text-" + item.id),

  container: (item: Item) => "container-" + item.id,
  getContainer: (item: Item) => document.getElementById("container-" + item.id),

  item: (item: Item) => item.id,
  getItem: (item: Item) => document.getElementById(item.id),
};

// animations

function collapse(elem: HTMLElement) {
  const height = elem.clientHeight;
  elem.style.overflowY = "hidden";
  elem
    .animate([{ height: height + "px" }, { height: "0px" }], {
      duration: Math.max(200, height / 2),
      easing: "ease-in-out",
    })
    .addEventListener("finish", () => elem.remove());
}

function expand(elem: HTMLElement) {
  const height = elem.clientHeight;
  elem.style.overflowY = "hidden";
  elem
    .animate([{ height: "0px" }, { height: height + "px" }], {
      duration: Math.max(200, height / 2),
      easing: "ease-in",
    })
    .addEventListener("finish", () => {
      elem.style.removeProperty("overflow-y");
    });
}
