import pluginVue from "eslint-plugin-vue";
import skipTypeScript from "@vue/eslint-config-typescript";
import skipPrettier from "@vue/eslint-config-prettier";

export default [
  ...skipTypeScript(),
  skipPrettier,
  ...pluginVue.configs["flat/base"],
  {
    files: ["**/*.{js,ts,vue}"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
