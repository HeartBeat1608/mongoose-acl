import { AccessControlList } from "../AccessControlList";

var acl: AccessControlList | undefined = undefined;

beforeAll(() => {
  acl = new AccessControlList();
});

describe("AccessControlList", () => {
  test("should be defined", () => {
    // var acl = new AccessControlList();
    expect(acl).toBeDefined();
  });

  test("should have an ID", () => {
    expect(acl).toHaveProperty("_id");
  });

  test("should have a name", () => {
    expect(acl).toHaveProperty("Name");
  });
});
