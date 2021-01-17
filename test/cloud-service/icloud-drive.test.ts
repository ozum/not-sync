/* eslint-disable jest/expect-expect */
import testOptions from "../test-helper/test-options/standard";
import { generateAndTest } from "../test-helper/util";

describe("iCloudDrive with link to target directory", () => {
  it("should disable and enable cloud dir.", async () => {
    await generateAndTest("iCloudDrive", { ignoreConfigs: ".gitignore", linkSameDir: false }, testOptions);
  });
});
