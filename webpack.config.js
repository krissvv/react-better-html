const path = require("path");

module.exports = {
   entry: "./src/index.ts",
   output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      libraryTarget: "commonjs2",
   },
   resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
   },
   externals: {
      react: "react",
      "react-dom": "react-dom",
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/,
            use: [
               {
                  loader: "babel-loader",
                  options: {
                     presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                  },
               },
               "ts-loader",
            ],
            exclude: /node_modules/,
         },
      ],
   },
   devtool: "source-map",
   mode: "production",
};
