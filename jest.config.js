module.exports = {
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  testMatch: ["<rootDir>/test/**/*.(spec|test).{ts,tsx}"],
  testURL: "http://localhost",
  watchPlugins: [
    "jest-watch-typeahead/filename.js",
    "jest-watch-typeahead/testname.js"
  ]
};
