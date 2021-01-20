import type { ExtendedAnyFlags } from "meow-helper";

const flags: ExtendedAnyFlags = {
  cwd: { type: "string", desc: "Set current working directory for relative paths." },
  ignoreConfigs: {
    alias: "i",
    type: "string",
    desc: "(CSV) List of ignore files to update (e.g. .gitignore, .prettierignore).",
  },
  dry: { type: "boolean", desc: "Prevent changes to be written to disk. Executes a dry run." },
  verbose: { alias: "v", type: "boolean", desc: "Output extra information." },
};

export default flags;
