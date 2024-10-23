import { counties } from "./counties";

describe("counties", () => {
  it("should contain 32 counties", () => {
    expect(counties).toHaveLength(32);
  });
});
