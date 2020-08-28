const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  "mode": "development",
  "entry": "src/index.ts",
  "output": {
      "path": __dirname+'/dist',
      "filename": "[name].js"
  },
  "watch": false,
  "context": __dirname, // to automatically find tsconfig.json
  "module": {
      "rules": [
          {
              "test": /\.tsx?$/,
              "exclude": /node_modules/,
              "use": {
                  "loader": "babel-loader",
                  options: {
                    rootMode: 'upward',
                  },
                  // "loader": "ts-loader",
                  // "options": {
                  //     "transpileOnly": false,
                  //     "projectReferences": false
                  // }
              }
          }
      ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname)
    ],
    extensions: [".js", ".ts"]
  },
  // plugins: [new ForkTsCheckerWebpackPlugin()]
}