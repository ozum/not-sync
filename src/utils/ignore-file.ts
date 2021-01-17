import { dirname, resolve, relative } from "path";
import { promises as fs } from "fs";
import findUp from "find-up";
import mapToObject from "array-map-to-object";
import { Events } from "../index";
import { readFileToArray } from "./fs";
import { getRelative } from "./path";
import type { ServiceKey } from "../cloud-service/cloud-service";

interface IgnoreOptions {
  cwd: string;
  serviceKey: ServiceKey;
  dry?: boolean;
  on: Events;
}

/**
 * Finds ignore files and related entries for each ignore file.
 *
 * @param paths are paths to find their nearest ignore file.
 * @param cwd is the current working directory.
 * @returns ignore files and related entries.
 * @example
 * const gitIgnoreEntries = getIgnoreEntries("/a/k.txt", "/a/b/x.txt", "/a/b/y.txt"); // = { "/a/.gitignore": ["k.txt"], /a/b/.gitignore": ["x.txt", "y.txt"] }
 */
async function getIgnoreEntries(ignoreName: string, paths: string[], { cwd }: { cwd: string }): Promise<Record<string, Set<string>>> {
  const ignoreEntries: Record<string, Set<string>> = {}; // ".gitignore path": ["entry 1", "entry 2"].
  const absolutePaths = paths.map((path) => resolve(cwd, path));
  const dirs = [...new Set(absolutePaths.map((path) => dirname(path)))];
  const ignoreFilePaths = await Promise.all(dirs.map((dir) => findUp(ignoreName, { cwd: dir })));
  const ignoreFilePathOf = mapToObject(ignoreFilePaths, (value, i) => [dirs[i], value]);
  absolutePaths.forEach((absolutePath) => {
    const ignoreFilePath = ignoreFilePathOf[dirname(absolutePath)];
    if (ignoreFilePath) {
      const entry = getRelative(ignoreFilePath, absolutePath);
      ignoreEntries[ignoreFilePath] ??= new Set();
      ignoreEntries[ignoreFilePath].add(entry);
    }
  });
  return ignoreEntries;
}
// async function getIgnoreEntries(ignoreFileName: string, paths: string[], { cwd }: { cwd: string }): Promise<Record<string, Set<string>>> {
//   const nearestIgnorePaths: Record<string, string> = {}; // "dirname of file": ".gitignore path".
//   const ignoreEntries: Record<string, Set<string>> = {}; // ".gitignore path": ["entry 1", "entry 2"].
//   const absolutePaths = paths.map((path) => resolve(cwd, path));

//   // eslint-disable-next-line no-restricted-syntax
//   for (const absolutePath of absolutePaths) {
//     const absoluteDir = dirname(absolutePath);
//     if (!nearestIgnorePaths[absoluteDir]) {
//       const ignorePath = await findUp(ignoreFileName, { cwd: absoluteDir }); // eslint-disable-line no-await-in-loop
//       if (!ignorePath) continue; // eslint-disable-line no-continue
//       nearestIgnorePaths[absoluteDir] = ignorePath;
//     }
//     const ignorePath = nearestIgnorePaths[absoluteDir];
//     const entry = getRelative(ignorePath, absolutePath);
//     ignoreEntries[ignorePath] ??= new Set();
//     ignoreEntries[ignorePath].add(entry);
//   }

//   return ignoreEntries;
// }

/**
 * Deletes entries from given ignore file.
 *
 * @param ignorePath is the path of the ignore file.
 * @param entries are the entries to delete.
 * @param options are options.
 */
async function deleteEntriesFromSingleIgnore(ignorePath: string, entries: Set<string>, options: IgnoreOptions): Promise<void> {
  const { lines, eol } = await readFileToArray(ignorePath);
  const newLines = lines.filter((line) => !entries.has(line));
  if (lines.length !== newLines.length) {
    if (!options.dry) await fs.writeFile(ignorePath, newLines.join(eol), { encoding: "utf8" });
    if (options.on?.deleteEntry) options.on.deleteEntry(options.serviceKey, relative(options.cwd, ignorePath), [...entries]);
  }
}

/**
 * Deletes given paths from their nearest ignore file, if entry already does not exist in that ignore.
 * Uses relative path from ignore to target path.
 *
 * @param paths are the paths to be deleted from their nearest ignore.
 * @param options are options.
 */
export async function deleteIgnoreEntries(ignoreFileName: string, paths: string[], options: IgnoreOptions): Promise<void[]> {
  const allEntries = await getIgnoreEntries(ignoreFileName, paths, { cwd: options.cwd });
  return Promise.all(
    Object.entries(allEntries).map(([ignorePath, entries]) => deleteEntriesFromSingleIgnore(ignorePath, entries, options))
  );
}

/**
 * Adds new entries to given ignore file.
 *
 * @param ignoreFilePath is the path of the ignore file.
 * @param entries are the entries to add.
 * @param options are options.
 */
async function addEntriesToSingleIgnore(ignoreFilePath: string, entries: Set<string>, options: IgnoreOptions): Promise<void> {
  const { lines, eol } = await readFileToArray(ignoreFilePath);
  const lineSet = new Set(lines);
  const newEntries = [...entries].filter((entry) => !lineSet.has(entry));
  if (newEntries.length > 0) {
    if (!options.dry) await fs.appendFile(ignoreFilePath, `${newEntries.join(eol)}${eol}`);
    if (options.on?.addEntry) options.on.addEntry(options.serviceKey, relative(options.cwd, ignoreFilePath), [...entries]);
  }
}

/**
 * Adds given paths to their nearest ignore file, if entry already does not exist in that ignore file.
 * Uses relative path from ignore file to target path.
 *
 * @param paths are the paths to be added to their nearest ignore file.
 * @param options are options.
 */
export async function addIgnoreEntries(ignoreFileName: string, paths: string[], options: IgnoreOptions): Promise<void[]> {
  const allEntries = await getIgnoreEntries(ignoreFileName, paths, { cwd: options.cwd });
  return Promise.all(
    Object.entries(allEntries).map(([ignoreFilePath, entries]) => addEntriesToSingleIgnore(ignoreFilePath, entries, options))
  );
}
