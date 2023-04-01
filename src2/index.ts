import { div, span, img } from "../src/platform";
import { tree } from "../src/core/initialState";
import "./index.scss";
import { Item } from "../src/core/tree";

function renderItem(item: Item) {
  return div({
    id: item.id,
    class: "item",
    children: [div({ class: "item-icon" }), item.title],
  });
}

const app = div({
  class: "page",
  children: tree.root.children.map(renderItem),
});

document.body.appendChild(app);

//
//
//
//
// Selection
const selectedItem = tree.root.children[1];
const selectionBox = div({ class: "selection-box" });
document.body.insertAdjacentElement("afterbegin", selectionBox);

const selectedDiv = document.getElementById(selectedItem.id);
if (selectedDiv) {
  const rect = selectedDiv.getBoundingClientRect();
  selectionBox.style.top = rect.top + "px";
  selectionBox.style.height = rect.height + "px";
}
