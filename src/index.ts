import { div, img } from "./platform";
import { tree } from "./core/initialState";
// import { createApp } from "./ui/ui";
// import { selectItem } from "./ui/selectionBox";
// import "./input";
import "./index.scss";
import { Item } from "./core";

const SHOW_IMAGES = false;

function viewChildren(item: Item): HTMLElement {
  const res = div({
    class: {
      children: true,
      [`${item.type}-children`]: true,
      "full-width-children": item.view === "board",
      board: item.view === "board",
      gallery: item.view === "gallery" && SHOW_IMAGES,
    },
    children:
      item.view === "gallery" && SHOW_IMAGES
        ? item.children.map(viewGalleryItem)
        : item.children.map(viewItem),
  });

  if (item.view === "board") {
    function resizeBoard() {
      if (res.parentElement) {
        const rect = res.parentElement.getBoundingClientRect();
        res.style.marginLeft = -rect.left + "px";
        res.style.paddingLeft = rect.left + 20 + "px";
      }
    }
    // memory leak
    window.addEventListener("resize", resizeBoard);

    // waiting for element to be inserted into the DOM to get it's dimensions
    requestAnimationFrame(resizeBoard);
  }

  return res;
}

function viewIcon(item: Item): HTMLElement {
  return item.imageUrl && SHOW_IMAGES
    ? img({ src: item.imageUrl, class: `${item.type}-square` })
    : div({ class: "folder-icon" });
}

function viewItem(item: Item): HTMLElement {
  return div({
    children: [
      div({
        class: "item",
        children: [
          viewIcon(item),
          div({ class: "item-text", children: item.title }),
        ],
      }),

      item.isOpen && viewChildren(item),
    ],
  });
}

function viewGalleryItem(item: Item): HTMLElement {
  return div({
    class: "gallery-item",
    children: [
      img({ src: item.imageUrl || "" }),
      div({ children: item.title }),
    ],
  });
}

const app = div({
  class: "page",

  children: viewChildren(tree.root),
});

document.body.appendChild(app);

// selectItem(tree.root.children[0]);
