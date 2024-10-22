import { hashPassword } from "./auth";

describe("hashPassword", () => {
  it("should return a string", async () => {
    const stringToBeHashed = "very_secure_password";
    const hashedString = await hashPassword(stringToBeHashed);

    expect(typeof hashedString).toBe("string");
  });

  it("should return a hashed string not equal to the string passed into the function", async () => {
    const stringToBeHashed = "very_secure_password";
    const hashedString = await hashPassword(stringToBeHashed);

    expect(stringToBeHashed).not.toEqual(hashedString);
  });
});
