import { chalk } from "meow-helper";
import type { MoveErrorCode, ServiceKey, Events, Options } from "../../index";
import { getCWD } from "../../utils/path";

import { log, formatPath, list } from "./log";

const { green } = chalk;

export const disableEvents: Events = {
  found: (service: ServiceKey, files: string[]): void =>
    log(service, "info", `${green.bold.underline(`Will disable ${service} sync for following paths:`)}${list(files)}`),
  moveFail: (service: ServiceKey, errorCode: MoveErrorCode, from = "", to = ""): void => {
    if (errorCode === "NOSRC") log(service, "error", `File not found: ${formatPath(from)}`);
    else if (errorCode === "LINKEXIST") log(service, "info", `Already disabled: ${formatPath(from, to)}`);
    else if (errorCode === "NOTALINK") log(service, "error", `Is not a Link: ${formatPath(to)}`);
    else if (errorCode === "NOTFOUND") log(service, "error", `Link file not found: ${formatPath(to)}`);
    else if (errorCode === "NOTARGET") log(service, "error", `Link target not found: ${formatPath(to, from)}`);
  },
  move: (service: ServiceKey, from: string, to: string): void => log(service, "success", `Moved: ${formatPath(from, to)}`),
  symlink: (service: ServiceKey, target: string, path: string): void => log(service, "success", `Symlinked: ${formatPath(path, target)}`),
  delete: (service: ServiceKey, path: string, type: "symlink" | "parent"): void =>
    log(service, "success", `Deleted ${type === "symlink" ? "Symlink" : "Dir"}: ${formatPath(path)}`),
  addEntry: (service: ServiceKey, ignoreFile: string, entries: string[]): void =>
    log(service, "success", `Added Entries: ${ignoreFile}:${entries}`),
  deleteEntry: (service: ServiceKey, ignoreFile: string, entries: string[]): void =>
    log(service, "success", `Deleted Entries from ${ignoreFile}:${list(entries)}:`),
  notFound: (files: string[]): void =>
    log("general", "error", `Paths below cannot be processed, because they are not in a known cloud path:${list(files, "✖")}`),
};

export const enableEvents: Events = {
  ...disableEvents,
  found: (service: ServiceKey, files: string[]): void =>
    log(service, "info", `${green.bold.underline(`Will enable ${service} sync for following paths:`)}${list(files)}`),
};

export function logInfo(options: Options): void {
  if (options.dry) log("", "warning", chalk`{yellow DRY RUN}: Dry run mode is on. No changes will be written to disk.`);
  log("", "info", chalk`{blue CWD:} ${getCWD(options.cwd)}`);
}
