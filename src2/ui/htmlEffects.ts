//
// HTML effects

import { viewChildren, viewItem } from "..";
import { Item } from "../core";

//
export function closeItem(item: Item) {
  item.isOpen = false;
  ids.getChildren(item)?.remove();
}

export function openItem(item: Item) {
  item.isOpen = true;
  ids.getItem(item)?.insertAdjacentElement("afterend", viewChildren(item));
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
