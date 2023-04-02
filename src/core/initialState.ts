import { board, channel, channelAsBoard, item, video } from "./tree";

export const tree = {
  root: item("Root", [
    item("Fizz", [item("Inner Fizz"), item("Inner Buzz")]),
    item("Buzz"),
    //
  ]),
};
