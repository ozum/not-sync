import { readFileSync } from "fs";
import { join } from "path";

export default JSON.parse(readFileSync(join(__dirname, "../../../package.json"), { encoding: "utf8" }));
