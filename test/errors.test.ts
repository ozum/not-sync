/**
 * Test error conditions.
 */

/* eslint-disable jest/expect-expect */

import { generateAndTest } from "./test-helper/util";

describe("disable", () => {
  it("should throw if source and target exist and source is not a symbolic link.", async () => {
    const testOptions = {
      paths: ["a"],
      projectFiles: { a: "", "a.nosync": "Cause Error" },
      expectedFiles: {},
    };
    await expect(() => generateAndTest("iCloudDrive", {}, testOptions)).rejects.toThrow("NOTCOMP");
  });

  it("should report if source does not exist.", async () => {
    const testOptions = {
      paths: ["a"],
      projectFiles: { someFile: "" },
      expectedFiles: { someFile: "" },
    };
    const { eventResults } = await generateAndTest("iCloudDrive", {}, { ...testOptions, enable: false });
    expect(eventResults.moveFail[1]).toBe("NOSRC");
  });

  it("should report if target link does not exist.", async () => {
    const testOptions = {
      paths: ["a"],
      projectFiles: { someFile: "" },
      expectedFiles: { someFile: "" },
    };
    const { eventResults } = await generateAndTest("iCloudDrive", { verbose: true }, { ...testOptions });
    expect(eventResults.moveFail[1]).toBe("NOTFOUND");
  });

  it("should report if source and target exist and source is a symbolic link.", async () => {
    const testOptions = {
      paths: ["a"],
      projectFiles: { a: { $type: "Symlink", target: "." }, "a.nosync": "" },
      expectedFiles: { a: { $type: "Symlink", target: "." }, "a.nosync": "" },
    };
    const { eventResults } = await generateAndTest("iCloudDrive", {}, { ...testOptions, enable: false });
    expect(eventResults.moveFail[1]).toBe("LINKEXIST");
  });

  it("should not move and link if source is a symbolic link.", async () => {
    const testOptions = {
      paths: ["a"],
      projectFiles: { a: { $type: "Symlink", target: "." } },
      expectedFiles: { a: { $type: "Symlink", target: "." } },
    };
    await generateAndTest("iCloudDrive", {}, { ...testOptions, enable: false });
  });
});
