const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   mode: "development",
   entry:
   {
      content_AllUrls: './src/ts/content_AllUrls.ts',
      content_chatGpt: './src/ts/content_chatGpt.ts',
      content_wikipedia: './src/ts/content_wikipedia.ts',
      content_noYT: './src/ts/content_noYT.ts',
      background: './src/ts/background.ts',
      options: './src/ts/options.ts',
      popup: './src/ts/popup.ts',
   },
   output: {
      path: path.join(__dirname, "extension/js"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
      alias: {
         '@modules': path.resolve(__dirname, "../modules")

      }
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            // include: [
            //    path.resolve(__dirname),
            //    path.resolve(__dirname, "../modules/utils/utils.ts")
            // ],
            exclude: /node_modules/,
         },
      ],
   },
   devtool: 'source-map',
   plugins: [
      // new CopyPlugin({
      //    patterns: [
      //       // { from: ".", to: ".", context: "public" },
      //       { from: 'src/css', to: '../css' },
      //       { from: 'src/html', to: '../html' },
      //       { from: 'src/images', to: '../images' },
      //       { from: 'src/manifest.json', to: '../manifest.json' }
      //    ],
      // }),
   ],
};