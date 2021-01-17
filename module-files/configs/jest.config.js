const ignorePatterns = [
  "<rootDir>/dist/",
  "<rootDir>/node_modules/",
  "<rootDir>/node_modules.nosync/",
  "/test-helper/",
  "/__test__/",
  "<rootDir>/.eslintrc.js",
];

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  modulePathIgnorePatterns: ["<rootDir>/node_modules.nosync/"],
};
