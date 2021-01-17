/* eslint-disable jest/expect-expect */
import testOptions from "../test-helper/test-options/standard";
import { generateAndTest } from "../test-helper/util";

describe("Dropbox", () => {
  it("should disable and enable cloud dir.", async () => {
    await generateAndTest("dropbox", { ignoreConfigs: ".gitignore" }, testOptions);
  });
});
