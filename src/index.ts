import type { ServiceKey } from "./cloud-service/cloud-service";

export { enable, disable } from "./main";

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

export interface Options {
  cwd?: string;
  ignoreConfigs?: string | string[];
  dry?: boolean;
  on?: Events;
  verbose?: boolean;
  roots?: Partial<Record<ServiceKey, string>>;
  targetRoots?: Partial<Record<ServiceKey, string>>;
  linkSameDir?: boolean;
}
