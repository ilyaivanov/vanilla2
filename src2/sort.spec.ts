it("sort", () => {});

it("Correctly handles duplicate elements in the array", () => {
  const unsortedArray = [2, 5, 3, 1, 4, 2];
  const sortedArray = [1, 2, 2, 3, 4, 5];
  sortArray(unsortedArray);
  expect(unsortedArray).toEqual(sortedArray);
});

function sortArray(numbers: number[]) {
  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = 0; j < numbers.length - i - 1; j += 1) {
      if (numbers[j] > numbers[j + 1]) {
        const temp = numbers[j + 1];
        numbers[j + 1] = numbers[j];
        numbers[j] = temp;
      }
    }
  }
}
