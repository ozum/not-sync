/* eslint-disable class-methods-use-this */
import { homedir } from "os";
import { promises as fs } from "fs";
import { basename, join, resolve, relative } from "path";
import rmUp from "rm-up";
import { deleteIgnoreEntries, addIgnoreEntries } from "../utils/ignore-file";
import { elstat, getLinkTarget, symlink, unlink, move } from "../utils/fs";
import SyncError from "../utils/error";
import { arrify } from "../utils/helper";
import { getLinkPaths, contains } from "../utils/path";
import type { Events, MoveErrorCode, OnDelete, Options } from "../index";
import type { FsOptions } from "../utils/fs";

export type ServiceOptions = Omit<Options, "cwd" | "linkSameDir" | "targetRoots" | "roots"> & {
  cwd: string;
  root?: string;
  targetRoot?: string;
  suffix?: string;
};

export type ServiceKey = "iCloudDrive" | "dropbox" | "oneDrive";

export default abstract class CloudService {
  protected static defaultRoot: string;
  protected readonly root: string;
  public readonly cloudDirs: string[];
  public readonly targetRoot: string;
  protected readonly cwd: string;
  protected readonly ignoreConfigs: string[];
  protected readonly dry?: boolean;
  protected readonly suffix?: string;
  protected readonly on: Events;
  protected readonly verbose?: boolean;
  protected readonly createDirs?: boolean;

  public constructor(options: ServiceOptions) {
    this.root = options.root ?? this.Class.defaultRoot;
    if (this.Class.defaultRoot === undefined) throw new SyncError("NOROOT");
    this.cloudDirs = [this.root, ...this.calculateCloudDirs()];
    this.targetRoot = options.targetRoot ?? this.getDefaultTargetRoot(options.root);
    this.cwd = options.cwd;
    this.ignoreConfigs = options.ignoreConfigs !== undefined ? arrify(options.ignoreConfigs) : [];
    this.dry = options.dry;
    this.suffix = options.suffix;
    this.on = options.on ?? {};
    this.verbose = options.verbose;
    this.createDirs = options.createDirs;
  }

  protected calculateCloudDirs(): string[] {
    return [];
  }

  protected get Class(): typeof CloudService {
    return this.constructor as typeof CloudService;
  }

  /**
   * Get default target root. If user provides a root for cloud service. A directory near the root is used.
   * Otherwise a directory in user home is used.
   *
   * @param userProvidedRoot is the root path for cloud service.
   * @returns default target root for this service.
   */
  protected getDefaultTargetRoot(userProvidedRoot?: string): string {
    return userProvidedRoot === undefined
      ? join(homedir(), `${basename(this.root)} Linked Files`)
      : join(userProvidedRoot, `../${basename(this.root)} Linked Files`);
  }

  protected get fsOptions(): FsOptions {
    return { cwd: this.cwd, dry: this.dry, on: this.on, serviceKey: this.Class.serviceKey };
  }

  /**
   * Get destination path for original file to move.
   *
   * @param path is the path of original file to get destination for.
   * @returns destination path to move original file.
   */
  protected getLinkTarget(path: string): string {
    const relativeToRoot = relative(this.root, resolve(this.cwd || "", path));
    return this.suffix ? `${path}${this.suffix}` : join(this.targetRoot, relativeToRoot);
  }

  /**
   * Camelcase version of the class name. May be used as a prefix in arguments and parameters.
   *
   * @example
   * const rootArgName = `${ICloud.key}Root`; // => iCloudRoot;
   */
  public static get serviceKey(): ServiceKey {
    return (this.name[0].toLowerCase() + this.name.substring(1)) as ServiceKey;
  }

  /**
   * Checks whether given path is under any level in cloud directory.
   *
   * @param path is the path to check.
   * @returns whether given path is under any level in cloud directory
   */
  public isCloudPath(path: string): boolean {
    return this.cloudDirs.some((cloudDir) => contains(cloudDir, resolve(this.cwd, path)));
  }

  /**
   * Filters cloud paths among given paths.
   *
   * @param paths ar the paths to filter.
   * @returns paths belonging cloud service.
   */
  public filterCloudPaths(paths: string[]): string[] {
    return paths.filter((path) => this.isCloudPath(path));
  }

  /**
   * Moves file and creates a symbolic link in place of original file pointing to new path.
   * If both files are under given `cwd`, it is assumed both files are part of a same project and
   * link is created using a relative path to make it point correct target if project folder is changed in future.
   *
   * @param from is the old path to move from.
   * @param to is the new path to move to.
   * @returns absolute path of source file if moved and linked successfully, `undefined` otherwise.
   * @throws `NOTCOMP` if old and new path exists, but original file is not a sybolic link.
   */
  private async moveAndLink(from: string, to: string): Promise<string | undefined> {
    const { fromAbsolutePath, toAbsolutePath, linkPath } = getLinkPaths(from, to, { cwd: this.cwd });
    if (this.createDirs) await fs.mkdir(fromAbsolutePath, { recursive: true });
    const [fromStats, toStats] = await Promise.all([elstat(fromAbsolutePath), elstat(toAbsolutePath)]);

    if (fromStats && toStats && !fromStats.isSymbolicLink()) throw new SyncError("NOTCOMP", from);

    let errorCode: MoveErrorCode | undefined = undefined;

    if (!fromStats) errorCode = "NOSRC";
    else if (fromStats && toStats && fromStats.isSymbolicLink()) errorCode = "LINKEXIST";
    if (errorCode && this.on?.moveFail) this.on.moveFail(this.Class.serviceKey, errorCode, from, to);
    else if (!errorCode && fromStats && !fromStats?.isSymbolicLink()) {
      await move(fromAbsolutePath, toAbsolutePath, this.fsOptions);
      await symlink(linkPath, fromAbsolutePath, this.fsOptions);
    }

    return errorCode ? undefined : toAbsolutePath;
  }

  /**
   * Deletes symbolic link at `newPath` and  moves file from `oldPath` to `newPath`.
   *
   * @param originalPath is the old path to move from.
   * @returns absolute path of target of link if file is moved successfully, `undefined` otherwise.
   */
  private async moveToOriginal(originalPath: string): Promise<string | undefined> {
    const originalAbsolutePath = resolve(this.cwd, originalPath);

    try {
      const linkedAbsolutePath = await getLinkTarget(originalAbsolutePath, { absolute: true });
      await unlink(originalAbsolutePath, originalPath, this.fsOptions);
      await move(linkedAbsolutePath, originalAbsolutePath, this.fsOptions);
      const deleteOptions = { cwd: this.cwd, dry: this.dry, force: true, deleteInitial: true, stop: this.targetRoot };
      const deleted = await rmUp(linkedAbsolutePath, deleteOptions);
      if (this.on?.delete && deleted.length > 0) {
        if (this.verbose) deleted.forEach((path) => (this.on.delete as OnDelete)(this.Class.serviceKey, path, "parent"));
        else this.on.delete(this.Class.serviceKey, deleted[deleted.length - 1], "parent");
      }

      return linkedAbsolutePath;
    } catch (error) {
      if (!["NOTALINK", "NOTFOUND", "NOTARGET"].includes(error.code)) throw error;
      if (this.on?.moveFail) this.on.moveFail(this.Class.serviceKey, error.code, error.args[1], originalPath);
    }
    return undefined;
  }

  /**
   * Disables sync of given files/directories by moving them to an unsynced place and creates a symbolic link
   * in original place targeting the moved files/directories.
   *
   * @param path is the path to file/directory to disable sync.
   */
  public async notSync(paths: string[]): Promise<void> {
    const cloudPaths = this.filterCloudPaths(paths);
    if (cloudPaths.length === 0) return;
    if (this.on?.found) await this.on.found(this.Class.serviceKey, cloudPaths);

    const allLinkTargets = await Promise.all(cloudPaths.map((path) => this.moveAndLink(path, this.getLinkTarget(path))));
    const linkTargets = allLinkTargets.filter((path) => path !== undefined) as string[];

    if (linkTargets.length > 0) {
      const ignoreOptions = { cwd: this.cwd, dry: this.dry, on: this.on, serviceKey: this.Class.serviceKey };
      await Promise.all(this.ignoreConfigs.map((config) => addIgnoreEntries(config, linkTargets, ignoreOptions)));
    }
  }

  /**
   * Undoes and reverses what unsync does. Removes symoblic link and removes suffix such as `nosync`.
   *
   * @param path is the path to directory to enable sync.
   */
  public async resync(paths: string[]): Promise<void> {
    const cloudPaths = this.filterCloudPaths(paths);

    if (cloudPaths.length === 0) return;
    if (this.on?.found) await this.on.found(this.Class.serviceKey, cloudPaths);

    const allLinkTargets = await Promise.all(cloudPaths.map((path) => this.moveToOriginal(path)));
    const linkTargets = allLinkTargets.filter((target) => target !== undefined) as string[];

    if (linkTargets.length > 0) {
      const ignoreOptions = { cwd: this.cwd, dry: this.dry, on: this.on, serviceKey: this.Class.serviceKey };
      await Promise.all(this.ignoreConfigs.map((config) => deleteIgnoreEntries(config, linkTargets, ignoreOptions)));
    }
  }
}
