import { join, relative, dirname, basename, resolve, isAbsolute } from "path";

/** Gets parent module's CWD which installed this module. Otherwise returns CWD. */
export function getCWD(cwd?: string): string {
  return cwd ?? (process.env.INIT_CWD || process.cwd());
}

/**
 * Calculates relative path between two paths. Builtin `path.relative` does not return correct path if both
 * inputs are file.
 *
 * @param fromPath is the path get relative path from.
 * @param toPath is the path get relative path to.
 * @returns relative path between given paths.
 */
export function getRelative(fromPath: string, toPath: string): string {
  const relativePath = join(relative(dirname(fromPath), dirname(toPath)), basename(toPath));
  return relativePath;
  // return relativePath.includes("/") ? relativePath : `.${sep}${relativePath}`;
}

/**
 * Calclulates link path between given two paths. Also resolves given paths as absolute paths.
 *
 * @param from is the path to caliculate link from.
 * @param to is the path to caliculate link to.
 * @param cwd is current working directory.
 */
export function getLinkPaths(
  from: string,
  to: string,
  { cwd }: { cwd: string }
): { fromAbsolutePath: string; toAbsolutePath: string; linkPath: string } {
  const fromAbsolute = resolve(cwd, from);
  const toAbsolute = resolve(cwd, to);
  const absoluteCwd = resolve(cwd);
  const bothInCwd = cwd && fromAbsolute.startsWith(absoluteCwd) && toAbsolute.startsWith(absoluteCwd);
  const linkPath = bothInCwd ? getRelative(fromAbsolute, toAbsolute) : toAbsolute;
  return { fromAbsolutePath: fromAbsolute, toAbsolutePath: toAbsolute, linkPath };
}

/**
 * Tests whether a given paths is contained by other path.
 *
 * @param parent is the path which is tested as container.
 * @param child is the path which is tested as contained.
 * @returns whether child is contained by parent.
 */
export function contains(parent: string, child: string): boolean {
  const relativePath = relative(parent, child);
  return relativePath !== "" && !relativePath.startsWith("..") && !isAbsolute(relativePath);
}

/**
 * Find path relative to `cwd` if `cwd` contains path, otherwise get absolute path.
 *
 * @param path is the path to find relative path for if it is contained by `cwd`.
 * @param cwd is current working directory.
 * @returns path relative to `cwd` if `cwd` contains path. Otherwise returns path as it is.
 */
export function relativeIfContains(path: string, { cwd }: { cwd: string }): string {
  return contains(cwd, path) ? relative(cwd, path) : path;
}
