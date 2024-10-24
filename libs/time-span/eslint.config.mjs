import config from "../../eslint.config.mjs";

export default [
  ...config,
  {
    ignores: [".tshy/*", "dist/*", "mode_modules/*"],
  },
];
