/* eslint-disable @typescript-eslint/explicit-module-boundary-types, no-return-assign */
import { homedir, tmpdir } from "os";
import { join, sep } from "path";
import { promises as fs } from "fs";
import { symlink, create, load, Tree } from "fs-structure";
import mapToObject from "array-map-to-object";
import { ServiceKey, Options, notSync, resync, Events } from "../../src/index";

const EVENT_NAMES: Array<keyof Events> = ["found", "notFound", "move", "moveFail", "symlink", "delete", "deleteEntry", "addEntry"];

export const ICLOUD_DOCUMENTS = {
  "iCloud/Desktop": symlink({ target: `${homedir()}/Desktop` }),
  "iCloud/Documents": symlink({ target: `${homedir()}/Documents` }),
};

function convertSymlinks(tree: Tree, targetPath: string): Tree {
  const result: any = { ...tree };
  Object.keys(result)
    .filter((key) => typeof result[key] === "object" && result[key]?.$type === "Symlink")
    .forEach((key) => (result[key].target = result[key].target.replace("$targetPath", targetPath)));
  return result;
}

/**
 * Generates file structure and tests given service for the structure.
 *
 * @param service is the service name.
 * @param serviceOptions is the service options.
 * @param testOptions is the test options.
 */
export async function generateAndTest(
  service: ServiceKey,
  serviceOptions: Options,
  testOptions: {
    paths: string[];
    iCloudDocuments?: boolean;
    projectFiles: Tree;
    expectedFiles: Tree;
    expectedTargetFiles?: Tree;
    enable?: boolean;
  }
): Promise<any> {
  testOptions = { enable: true, ...testOptions }; // eslint-disable-line no-param-reassign
  let afterEnableFiles: Tree | undefined;

  // Create a temporary directory
  const tmpDir = await fs.mkdtemp(`${tmpdir()}${sep}`);

  // Determine mock root and target root.
  const root = join(tmpDir, "cloudDrive");
  const targetRoot = join(tmpDir, "cloudDrive Linked Files");

  // Project path under cloud service directory. e.g. `${tmpDir}/cloudDrive/Development/project`
  const projectPath = join(root, "Development/project");
  const targetPath = join(targetRoot, "Development/project");

  // Create iCloudDrive links to simulate Desktop & Documents folder syncronization options in iCloudDrive.
  if (testOptions.iCloudDocuments) await create(ICLOUD_DOCUMENTS, { cwd: root });

  // Create project files under project directory of cloud service.
  await create(testOptions.projectFiles, { cwd: projectPath });

  // Define event function which records event results into an object.
  const eventResults: Record<keyof Events, any> = {} as any;
  const on: Events = mapToObject(EVENT_NAMES, (eventName) => [eventName, (...args: any[]) => (eventResults[eventName] = args)]);

  // Combine options with options from function parameter.
  const options = { roots: { [service]: root }, targetRoots: { [service]: targetRoot }, on, linkSameDir: true, ...serviceOptions };

  // Record file system before operation.
  const beforeDisableFiles = await load(projectPath, { includeDirs: true });

  // Disable files in cloud service and record filesystem.
  await notSync(testOptions.paths, { cwd: projectPath, ci: true, ...options });
  const afterDisableFiles = await load(projectPath, { includeDirs: true });
  const afterDisableTargetFiles = service === "iCloudDrive" && options.linkSameDir ? {} : await load(targetPath, { includeDirs: true });

  // Enable files in cloud service and record filesystem.
  if (testOptions.enable) {
    await resync(testOptions.paths, { cwd: projectPath, ci: true, ...options });
    afterEnableFiles = await load(projectPath, { includeDirs: true });
    expect(beforeDisableFiles).toEqual(afterEnableFiles);
  }

  expect(afterDisableFiles).toEqual(convertSymlinks(testOptions.expectedFiles, targetPath));
  if (testOptions.expectedTargetFiles) {
    expect(afterDisableTargetFiles).toEqual(testOptions.expectedTargetFiles);
    await expect(fs.lstat(targetPath)).rejects.toThrow("ENOENT");
  }

  await fs.rmdir(tmpDir, { recursive: true });

  return { beforeDisableFiles, afterDisableFiles, afterEnableFiles, afterDisableTargetFiles, eventResults };
}
