const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:3000/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    // needed for micro front end integration
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Header": "./src/Header.jsx",
        "./Footer": "./src/Footer.jsx"
        /* 
        These expose the header and footer components from the home application
          now these components can be shared. 
          
          Although nothing changes in the UI, a remote entry file has been created for us under the hood. 
          To view the remote entry file, navigate your browser to the URL localhost:3000/remoteEntry.js
          This remote entry file, remoteEntry.js, is a manifest file of all the modules that are exposed by the home application.


        */

      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
