import type { ServiceKey } from "./cloud-service/cloud-service";

export { resync, notSync } from "./main";

export type { ServiceKey } from "./cloud-service/cloud-service";
export type MoveErrorCode = "NOSRC" | "LINKEXIST" | "NOTALINK" | "NOTFOUND" | "NOTARGET";
export type OnFound = (service: ServiceKey, files: string[]) => any | Promise<any>;
export type OnNotFound = (files: string[]) => any | Promise<any>;
export type OnMove = (service: ServiceKey, from: string, to: string) => any | Promise<any>;
export type OnMoveFail = (service: ServiceKey, errorCode: MoveErrorCode, from?: string, to?: string) => any | Promise<any>;
export type OnSymlink = (service: ServiceKey, target: string, path: string) => any | Promise<any>;
export type OnDelete = (service: ServiceKey, path: string, type: "symlink" | "parent") => any | Promise<any>;
export type OnAddEntry = (service: ServiceKey, ignoreFile: string, entries: string[]) => any | Promise<any>;
export type OnDeleteEntry = (service: ServiceKey, ignoreFile: string, entries: string[]) => any | Promise<any>;

export interface Events {
  found?: OnFound;
  notFound?: OnNotFound;
  move?: OnMove;
  moveFail?: OnMoveFail;
  symlink?: OnSymlink;
  delete?: OnDelete;
  addEntry?: OnAddEntry;
  deleteEntry?: OnDeleteEntry;
}

/** Options */
export interface Options {
  /** Current working directory to be used for resolving relative paths. */
  cwd?: string;
  /** Ignore configuration files (e.g. .gitignore, .prettierignore) to add new created files if any. */
  ignoreConfigs?: string | string[];
  /** Prevents changes to be written to disk. Executes a dry run. */
  dry?: boolean;
  /** Event handler functions to act on several events generated during operation. */
  on?: Events;
  /** Adds extra information to event handlers. */
  verbose?: boolean;
  /** Move files near original one for iCloudDrive. For example "node_modules" is moved "node_modules.nosync" in same directory. */
  linkSameDir?: boolean;
  /** Custom roots for each cloud service to move files. */
  targetRoots?: Partial<Record<ServiceKey, string>>;
  /** Roots of cloud services. If default roots has to be changed for same reson. */
  roots?: Partial<Record<ServiceKey, string>>;
  /** Create directories for non existing paths. (If they are in a cloud path). This may be used to disable sync of directories to be created in future. */
  createDirs?: boolean;
  /** By default "not-sync" does not excute any command on a CI (continous integration) environment. Set this option to true to execute on the CI. */
  ci?: boolean;
}
