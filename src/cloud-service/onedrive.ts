import { join } from "path";
import { homedir } from "os";
import CloudService from "./cloud-service";

export default class OneDrive extends CloudService {
  protected static defaultRoot = join(homedir(), "OneDrive");
}
