import { generateRandomId } from "./utils";

export type ItemType = "folder" | "channel" | "playlist" | "video";
export type Item = {
  id: string;
  title: string;
  children: Item[];
  parent?: Item;
  isOpen: boolean;
  view: "tree" | "board";
  type: ItemType;

  imageUrl?: string;
};

export const item = (text: string, children: Item[] = []): Item => {
  const item: Item = {
    title: text,
    children,
    isOpen: children.length > 0,
    id: generateRandomId(),
    view: "tree",
    type: "folder",
  };
  children.forEach((c) => (c.parent = item));
  return item;
};

export const channel = (
  text: string,
  image: string,
  children: Item[] = []
): Item => {
  const res = item(text, children);
  res.type = "channel";
  res.imageUrl = image;
  return res;
};

export const video = (
  text: string,
  image: string,
  children: Item[] = []
): Item => {
  const res = item(text, children);
  res.type = "video";
  res.imageUrl = image;
  return res;
};

export const board = (text: string, children: Item[] = []): Item => {
  const res = item(text, children);
  res.view = "board";
  return res;
};

export const closedItem = (text: string, children: Item[] = []): Item => {
  const result = item(text, children);
  result.isOpen = false;
  return result;
};

// Children Operations
export const unshiftChild = (parent: Item, child: Item) => {
  parent.children.unshift(child);
  child.parent = parent;
};

export const pushChild = (parent: Item, child: Item) => {
  parent.children.push(child);
  child.parent = parent;
};

export const appendChildAfter = (
  parent: Item,
  child: Item,
  appendAfter: Item
) => {
  const index = parent.children.indexOf(appendAfter);
  parent.children.splice(index + 1, 0, child);
  child.parent = parent;
};

export const insertChildAt = (parent: Item, child: Item, index: number) => {
  parent.children.splice(index, 0, child);
  child.parent = parent;
};

// Some layout-specific operations

// const isOneOfTheParents = (item: Item, parent: Item) => {
//   let current: Item | undefined = item;
//   while (current) {
//     if (current === parent) return true;
//     current = current.parent;
//   }
//   return false;
// };

export const getItemBelow = (focusedItem: Item, item: Item): Item | undefined =>
  (item.isOpen && item.children.length > 0) || focusedItem == item
    ? item.children[0]
    : getFollowingItem(item);

// missing focusedItem
export const getItemAbove = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) {
      const previousItem = parent.children[index - 1];
      if (previousItem.isOpen)
        return getLastNestedItem(
          previousItem.children[previousItem.children.length - 1]
        );
      return getLastNestedItem(previousItem);
    } else if (!isRoot(parent)) return parent;
  }
};

export const removeItem = (item: Item): Item => {
  if (!item.parent) return item;

  const context = item.parent.children;
  const index = context.indexOf(item);

  context.splice(index, 1);
  updateIsOpenFlag(item.parent);

  if (context.length == 0) {
    return item.parent!;
  } else if (index > 0) {
    return context[index - 1];
  } else {
    return context[index];
  }
};

const getFollowingItem = (item: Item): Item | undefined => {
  const followingItem = getFollowingSibling(item);
  if (followingItem) return followingItem;
  else {
    let parent = item.parent;
    while (parent && isLast(parent)) {
      parent = parent.parent;
    }
    if (parent) return getFollowingSibling(parent);
  }
};

const getFollowingSibling = (item: Item): Item | undefined =>
  getRelativeSibling(item, (currentIndex) => currentIndex + 1);

const getRelativeSibling = (
  item: Item,
  getNextItemIndex: (itemIndex: number) => number
): Item | undefined => {
  const context = item.parent?.children;
  if (context) {
    const index = context.indexOf(item);
    return context[getNextItemIndex(index)];
  }
};

const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

const isLast = (item: Item): boolean => !getFollowingSibling(item);

export function isRoot(item: Item) {
  return !item.parent;
}

function updateIsOpenFlag(item: Item) {
  item.isOpen = item.children.length > 0;
}
