/* eslint-disable jest/expect-expect */
import testOptions from "../test-helper/test-options/link-same-dir";
import { generateAndTest } from "../test-helper/util";

describe("iCloudDrive with link same directory", () => {
  it("should disable and enable cloud dir.", async () => {
    await generateAndTest("iCloudDrive", { ignoreConfigs: ".gitignore" }, testOptions);
  });

  it("should create non existing dirs.", async () => {
    const localTestOptions = {
      projectFiles: { "src/index.js": "ISI" },
      expectedFiles: {
        src: { $type: "Dir" },
        "src/index.js": "ISI",
        dist: { $type: "Symlink", target: "dist.nosync" },
        "dist.nosync": { $type: "Dir" },
      },
      paths: ["dist"],
      enable: false,
    };
    await generateAndTest("iCloudDrive", { createDirs: true }, localTestOptions);
  });
});
