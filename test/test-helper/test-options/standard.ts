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
    ".gitignore": `IGI${EOL}`,
    node_modules: { $type: "Symlink", target: "$targetPath/node_modules" },
    "README.md": { $type: "Symlink", target: "$targetPath/README.md" },
    src: { $type: "Dir" },
    "src/index.js": "ISI",
    "src/utils": { $type: "Dir" },
    "src/utils/u": { $type: "Dir" },
    "src/utils/u/k": { $type: "Symlink", target: "$targetPath/src/utils/u/k" },
    "src/utils/u/s": { $type: "Dir" },
    "src/utils/u/s/s.js": { $type: "Symlink", target: "$targetPath/src/utils/u/s/s.js" },
  },

  expectedTargetFiles: {
    node_modules: { $type: "Dir" },
    "node_modules/module": { $type: "Dir" },
    "node_modules/module/dist": { $type: "Dir" },
    "node_modules/module/dist/index.js": "INMDI",
    "README.md": "IR",
    src: { $type: "Dir" },
    "src/utils": { $type: "Dir" },
    "src/utils/u": { $type: "Dir" },
    "src/utils/u/k": { $type: "Dir" },
    "src/utils/u/k/k.js": "IUUKK",
    "src/utils/u/s": { $type: "Dir" },
    "src/utils/u/s/s.js": "IUUSS",
  },
};
