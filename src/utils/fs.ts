import { dirname, resolve } from "path";
import { EOL } from "os";
import { PathLike, Stats, promises as fs, lstatSync } from "fs";
import { relativeIfContains } from "./path";
import SyncError from "./error";
import type { Events } from "../index";
import type { ServiceKey } from "../cloud-service/cloud-service";
import { detectEOL } from "./helper";

export interface FsOptions {
  cwd: string;
  serviceKey: ServiceKey;
  on: Events;
  dry?: boolean;
}

/**
 * lstat function which does not throw if path does not exists. Instead returns undefined.
 *
 * @param path is the path to get lstat for.
 * @returns `stats` from `lstat` or `undefined`.
 */
export async function elstat(path: PathLike): Promise<Stats | undefined> {
  try {
    return await fs.lstat(path);
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
}

/**
 * Reads file and returns it's lines and end of line characters.
 *
 * @param path is the path of the file to read.
 * @returns end of line character and lines.
 */
export async function readFileToArray(path: string): Promise<{ lines: string[]; eol: string }> {
  const content = await fs.readFile(path, { encoding: "utf8" });
  const eol = detectEOL(content, EOL);
  return { lines: content.split(eol), eol };
}

/**
 * lstat function which does not throw if path does not exists. Instead returns undefined.
 *
 * @param path is the path to get lstat for.
 * @returns `stats` from `lstat` or `undefined`.
 */
export function elstatSync(path: PathLike): Stats | undefined {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
}

/**
 * Get target path of given symbolic link. Could be relative or absolute path.
 *
 * @param path is the path of the link.
 * @param absolute is whether to convert relative links paths to absolute. If it is already absolute this option has no effect since result is already absolute.
 * @returns target path.
 * @throws "NOTALINK" if path isnot a link, "NOTFOUND" if path cannot be found, "NOTARGET" if link target cannot be found.
 */
export async function getLinkTarget(path: string, { absolute = false } = {}): Promise<string> {
  const stats = await elstat(path); // lstat get stats of given file, but not follows links.
  if (!stats || !stats.isSymbolicLink()) throw new SyncError(stats ? "NOTALINK" : "NOTFOUND", path);
  const targetPath = await fs.readlink(path);
  const absoluteTargetPath = resolve(dirname(path), targetPath);
  const targetStats = await elstat(absoluteTargetPath); // Link may be a relative link. If it is relative, convert to absolute.
  if (!targetStats) throw new SyncError("NOTARGET", path, absoluteTargetPath);
  return absolute ? absoluteTargetPath : targetPath;
}

/**
 * Moves a file or directory.
 *
 * @param from is the path to move from.
 * @param to is the path to move to.
 */
export async function move(from: string, to: string, options: FsOptions): Promise<void> {
  if (!options.dry) {
    await fs.mkdir(dirname(to), { recursive: true });
    await fs.rename(from, to);
  }

  if (options.on?.move)
    options.on.move(options.serviceKey, relativeIfContains(from, { cwd: options.cwd }), relativeIfContains(to, { cwd: options.cwd }));
}

export async function symlink(target: string, path: string, options: FsOptions): Promise<void> {
  if (!options.dry) await fs.symlink(target, path);
  if (options.on?.symlink) options.on.symlink(options.serviceKey, target, path);
}

export async function unlink(absolutePath: string, linkedPath: string, options: FsOptions): Promise<void> {
  if (!options.dry) await fs.unlink(absolutePath);
  if (options.on?.delete) options.on.delete(options.serviceKey, linkedPath, "symlink");
}
