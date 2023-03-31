// utils

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numbers = Array.from(new Array(10)).map((_, i) => i.toString());
const idAlphabet = alphabet
  .map((l) => l.toLocaleLowerCase())
  .concat(alphabet)
  .concat(numbers);

const length = 8;
export function generateRandomId() {
  let results = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * idAlphabet.length);
    results += idAlphabet[randomIndex];
  }

  return results;
}

type MeasureTextFunction = (text: string) => number;

export function splitTextIntoLines(
  text: string,
  maxWidth: number,
  measureText: MeasureTextFunction
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const newLine = currentLine + " " + word;

    if (measureText(newLine) <= maxWidth) {
      currentLine = newLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);
  return lines;
}

export function getIndexAtCoordinate(
  text: string,
  xCoordinate: number,
  measureText: MeasureTextFunction
) {
  let res = 0;
  // Opportunity to use binary search here
  while (
    measureText(text.slice(0, res + 1)) < xCoordinate &&
    res < text.length
  ) {
    res += 1;
  }

  if (
    Math.abs(xCoordinate - measureText(text.slice(0, res))) >
    Math.abs(xCoordinate - measureText(text.slice(0, res + 1)))
  ) {
    res += 1;
  }

  // check if next char is closer to the input slice
  return res;
}

export function roundToClosestHalf(num: number): number {
  return num % 1 > 0.5 ? Math.ceil(num) - 0.5 : Math.floor(num) + 0.5;
}
