/* eslint-disable jest/expect-expect */
import testOptions from "../test-helper/test-options/standard";
import { generateAndTest } from "../test-helper/util";

describe("OneDrive", () => {
  it("should disable and enable cloud dir.", async () => {
    await generateAndTest("oneDrive", { ignoreConfigs: ".gitignore" }, testOptions);
  });
});
