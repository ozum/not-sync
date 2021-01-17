/* eslint-disable jest/expect-expect */
import testOptions from "../test-helper/test-options/link-same-dir";
import { generateAndTest } from "../test-helper/util";

describe("iCloudDrive with link same directory", () => {
  it("should disable and enable cloud dir.", async () => {
    await generateAndTest("iCloudDrive", { ignoreConfigs: ".gitignore" }, testOptions);
  });
});
