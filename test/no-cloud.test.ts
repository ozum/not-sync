/**
 * This test ensures when a file does not belong to any cloud service, it is reported.
 */

import { EOL } from "os";
import { generateAndTest } from "./test-helper/util";

const testOptions = {
  paths: ["README.md", "../../../xxx"],

  projectFiles: {
    ".gitignore": `IGI${EOL}`,
    "README.md": "IR",
  },

  expectedFiles: {
    ".gitignore": `IGI${EOL}`,
    "README.md": { $type: "Symlink", target: "$targetPath/README.md" },
  },

  expectedTargetFiles: {
    "README.md": "IR",
  },
};

describe("Dropbox", () => {
  describe("disable", () => {
    it("should disable and enable cloud dir.", async () => {
      const { eventResults } = await generateAndTest("dropbox", { ignoreConfigs: ".gitignore" }, testOptions);
      expect(eventResults.notFound).toEqual([["../../../xxx"]]);
    });
  });
});
