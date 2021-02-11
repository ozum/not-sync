import ci from "ci-info";
import ICloudDrive from "./cloud-service/icloud-drive";
import DropBox from "./cloud-service/dropbox";
import OneDrive from "./cloud-service/onedrive";
import { getCWD } from "./utils/path";
import { difference } from "./utils/helper";
import type { Options } from "./index";

const ServiceProviders = [ICloudDrive, DropBox, OneDrive];

async function callMethod(method: "notSync" | "resync", paths: string[], userOptions: Options): Promise<void> {
  if (ci.isCI && !userOptions.ci) return;
  if (!paths) throw new Error("Paths are required.");
  const options = { linkSameDir: true, ...userOptions, cwd: getCWD(userOptions.cwd) };
  let nonCloudPaths = paths;

  await Promise.all(
    ServiceProviders.map(async (ServiceProvider) => {
      const [root, targetRoot] = [options.roots?.[ServiceProvider.serviceKey], options.targetRoots?.[ServiceProvider.serviceKey]];
      const service = new ServiceProvider({ ...options, root, targetRoot });
      const servicePaths = service.filterCloudPaths(paths);
      nonCloudPaths = difference(nonCloudPaths, servicePaths);
      return service[method](servicePaths);
    })
  );

  if (nonCloudPaths.length > 0 && options?.on?.notFound) options.on.notFound(nonCloudPaths);
}

export async function resync(paths: string[], options: Options = {}): Promise<void> {
  return callMethod("resync", paths, options);
}

export async function notSync(paths: string[], options: Options = {}): Promise<void> {
  return callMethod("notSync", paths, options);
}
