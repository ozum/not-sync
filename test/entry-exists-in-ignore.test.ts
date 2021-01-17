/**
 * This test ensures when an entry exists in ignore file it is not added again.
 */

/* eslint-disable jest/expect-expect */

import { EOL } from "os";
import { generateAndTest } from "./test-helper/util";

const testOptions = {
  paths: ["README.md"],

  projectFiles: {
    ".gitignore": `IGI${EOL}README.md.nosync${EOL}`,
    ".eslintignore": `EGI${EOL}`,
    "README.md": "IR",
  },

  expectedFiles: {
    ".gitignore": `IGI${EOL}README.md.nosync${EOL}`,
    ".eslintignore": `EGI${EOL}README.md.nosync${EOL}`,
    "README.md": { $type: "Symlink", target: "README.md.nosync" },
    "README.md.nosync": "IR",
  },
};

describe("disable", () => {
  it("should not add duplicate entry to ignore file.", async () => {
    await generateAndTest("iCloudDrive", { ignoreConfigs: [".gitignore", ".eslintignore"] }, { ...testOptions, enable: false });
  });
});
