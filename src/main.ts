import ICloudDrive from "./cloud-service/icloud-drive";
import DropBox from "./cloud-service/dropbox";
import OneDrive from "./cloud-service/onedrive";
import { getCWD } from "./utils/path";
import { difference } from "./utils/helper";
import type { Options } from "./index";

const ServiceProviders = [ICloudDrive, DropBox, OneDrive];

async function switchTo(method: "enable" | "disable", paths: string[], userOptions: Options): Promise<void> {
  const options = { linkSameDir: true, ...userOptions, cwd: getCWD(userOptions.cwd) };
  let nonCloudPaths = paths;

  await Promise.all(
    ServiceProviders.map((ServiceProvider) => {
      const [root, targetRoot] = [options.roots?.[ServiceProvider.serviceKey], options.targetRoots?.[ServiceProvider.serviceKey]];
      const service = new ServiceProvider({ ...options, root, targetRoot });
      nonCloudPaths = difference(nonCloudPaths, service.filterCloudPaths(paths));
      return service[method](paths);
    })
  );

  if (nonCloudPaths.length > 0 && options?.on?.notFound) options.on.notFound(nonCloudPaths);
}

export async function enable(paths: string[], options: Options = {}): Promise<void> {
  return switchTo("enable", paths, options);
}

export async function disable(paths: string[], options: Options = {}): Promise<void> {
  return switchTo("disable", paths, options);
}
