process.env.NODE_ENV = "production";

module.exports = {
  extends: [
    "eslint-config-airbnb-base/rules/best-practices",
    "eslint-config-airbnb-base/rules/errors",
    "eslint-config-airbnb-base/rules/node",
    "eslint-config-airbnb-base/rules/style",
    "eslint-config-airbnb-base/rules/variables",
    "eslint-config-airbnb-base/rules/es6",
    "eslint-config-airbnb-base/rules/imports",
    "eslint-config-airbnb-base/rules/strict",
    "eslint-config-airbnb/rules/react",
    // "eslint-config-airbnb/rules/react-a11y"
    "eslint-config-prettier",
    "eslint-config-prettier/react"
    // @ts-ignore,
  ].map(require.resolve),
  settings: {
    node: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
    },
    "import/extensions": [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  rules: {
    // #region General JS
    "class-methods-use-this": "off",
    "consistent-return": "warn", // Open to discussion
    curly: ["error", "all"],
    "no-await-in-loop": "warn",
    "no-confusing-arrow": "warn", // conflicts with prettier, automate using eslint,
    "no-continue": "off",
    "no-dupe-args": "off", // Not compatible with decorators yet
    "no-empty-function": "off",
    "no-fallthrough": "off",
    "no-nested-ternary": "off",
    "no-plusplus": "off", // Open to discussion
    "no-prototype-builtins": "off",
    "no-redeclare": "off", // Not compatible with decorators yet
    "no-restricted-globals": "off", // Not compatible with decorators yet
    "no-restricted-syntax": "off",
    "no-return-await": "warn",
    "no-shadow": "off", // Not compatible with decorators yet
    "no-undef": "off", // doesn't work with TS types
    "no-underscore-dangle": "off", // conflicts with mongodb ids
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    "no-unused-vars": "off",
    "no-useless-constructor": "off",
    "no-use-before-define": "off",
    // #endregion

    // #region React
    "react/prop-types": "off",
    "react/jsx-filename-extension": "off",
    "react/sort-comp": "off", // TODO: Re-enable this with less strict sort order
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // #endregion

    // #region TypeScript
    "@typescript-eslint/adjacent-overload-signatures": "warn",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/interface-name-prefix": "off", // currently broken
    "@typescript-eslint/member-delimiter-style": "off", // Prettier fixes this
    "@typescript-eslint/member-naming": "off", // Open to discussion
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-type-alias": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true, typedefs: false }
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/prefer-namespace-keyword": "off",
    "@typescript-eslint/type-annotation-spacing": "off",
    // #endregion

    // #region import
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    "import/no-unresolved": "off", // let TS handle this
    "import/prefer-default-export": "off", // Open to discussion
    "import/named": "off", // does not work for exported types
    "import/no-cycle": "warn" // doesn't differentiate between type and instance imports
    // #endregion
  }
};
