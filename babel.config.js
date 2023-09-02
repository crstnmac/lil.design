module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            '@app': "./src",
            '@components': "./src/components",
            '@screens': "./src/screens",
            '@assets': "./assets",
            '@navigation': "./src/navigation",
            '@store': "./src/store",
            '@types': "./src/types",
            "@providers": "./src/providers",
            "@lib": "./src/lib",
          },
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
        },
      ],
      ["react-native-reanimated/plugin"],
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};
