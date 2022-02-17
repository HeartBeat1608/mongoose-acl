import { getListIntersection, listIntersection } from "../intersect";

describe("listIntersection", () => {
  test("should check list intersection", () => {
    const lst = listIntersection([1, 2, 3, 4], [2, 3, 5, 6, 7]);
    expect(lst).toBeTruthy();
  });

  test("should show list intersection", () => {
    const lst = getListIntersection([1, 2, 3, 4], [2, 3, 5, 6, 7]);
    expect(lst).toHaveLength(2);
  });
});
