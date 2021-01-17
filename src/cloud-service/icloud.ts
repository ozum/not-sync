/* eslint-disable class-methods-use-this */
import { homedir, platform } from "os";
import { join } from "path";
import { elstatSync } from "../utils/fs";
import CloudService from "./cloud-service";
import type { Options } from "./cloud-service";

interface ICloudOptions extends Options {
  linkSameDir?: boolean;
}

const ROOT_DIR: Record<string, string> = { darwin: "Library/Mobile Documents/com~apple~CloudDocs/" };

export default class ICloud extends CloudService {
  protected static defaultRoot = join(homedir(), ROOT_DIR[platform()] ?? "iCloudDrive");

  public constructor(options: ICloudOptions) {
    super({ ...options, suffix: options.linkSameDir ? ".nosync" : undefined });
  }

  /** Returns list of synced directories. */
  protected calculateCloudDirs(): string[] {
    const isDocumentsDesktopEnabled = elstatSync(join(this.root, "Documents"))?.isSymbolicLink();
    const cloudDirs = isDocumentsDesktopEnabled ? [join(homedir(), "Documents"), join(homedir(), "Desktop")] : [];
    return cloudDirs;
  }
}
