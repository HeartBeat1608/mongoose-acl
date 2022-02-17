import { toTest } from "../index";

describe("index.js", () => {
  test('should print "Working"', () => {
    expect(toTest()).toBe("Working");
  });
});
