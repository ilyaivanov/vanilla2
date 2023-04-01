import { div, span, img } from "./platform";
import { tree, Item } from "./core";
import "./index.scss";
import "./app.scss";
import "./levels.scss";

function render(
  item: Item,
  level: number,
  isInsideBoard: boolean
): HTMLElement {
  const isBoard = item.view === "board";
  const nextLevel = level + 1;
  return div({
    children: [
      div({
        class: {
          item: true,
          [`level-${level}`]: !isInsideBoard,
          [`level-inside-board-${level}`]: isInsideBoard,
        },
        children: [
          item.imageUrl
            ? img({
                src: item.imageUrl,
                class: {
                  "channel-circle": item.type == "channel",
                  "video-preview": item.type == "video",
                  //
                },
              })
            : span({
                class: {
                  circle: true,
                  empty: item.children.length == 0,
                },
              }),
          item.title,
        ],
      }),

      item.isOpen &&
        div({
          class: {
            children: true,
            board: isBoard,
            ["board-" + nextLevel]: isBoard,
            "scroll-container": isBoard,
          },
          children: [
            ...item.children.map((i) =>
              render(i, isBoard ? 0 : nextLevel, isInsideBoard || isBoard)
            ),
            item.view !== "board"
              ? div({
                  class: {
                    level: true,
                    [`children-line-${nextLevel}`]: !isInsideBoard,
                    [`children-line-inside-board-${level}`]: isInsideBoard,
                  },
                })
              : undefined,
          ],
        }),
    ],
  });
}

function createApp() {
  return div({
    children: tree.root.children.map((i) => render(i, 0, false)),
  });
}

document.body.appendChild(createApp());
