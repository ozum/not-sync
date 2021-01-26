import { EOL } from "os";

export default {
  paths: ["README.md", "node_modules", "src/utils/u/s/s.js", "src/utils/u/k"],

  projectFiles: {
    ".gitignore": `IGI${EOL}`,
    "README.md": "IR",
    "src/index.js": "ISI",
    "src/utils/u/s/s.js": "IUUSS",
    "src/utils/u/k/k.js": "IUUKK",
    "node_modules/module/dist/index.js": "INMDI",
  },

  expectedFiles: {
    ".gitignore": `IGI${EOL}README.md.nosync${EOL}node_modules.nosync${EOL}src/utils/u/s/s.js.nosync${EOL}src/utils/u/k.nosync${EOL}`,
    node_modules: { $type: "Symlink", target: "node_modules.nosync" },
    "node_modules.nosync": { $type: "Dir" },
    "node_modules.nosync/module": { $type: "Dir" },
    "node_modules.nosync/module/dist": { $type: "Dir" },
    "node_modules.nosync/module/dist/index.js": "INMDI",
    "README.md": { $type: "Symlink", target: "README.md.nosync" },
    "README.md.nosync": "IR",
    src: { $type: "Dir" },
    "src/index.js": "ISI",
    "src/utils": { $type: "Dir" },
    "src/utils/u": { $type: "Dir" },
    "src/utils/u/k": { $type: "Symlink", target: "k.nosync" },
    "src/utils/u/k.nosync": { $type: "Dir" },
    "src/utils/u/k.nosync/k.js": "IUUKK",
    "src/utils/u/s": { $type: "Dir" },
    "src/utils/u/s/s.js": { $type: "Symlink", target: "s.js.nosync" },
    "src/utils/u/s/s.js.nosync": "IUUSS",
  },
};
