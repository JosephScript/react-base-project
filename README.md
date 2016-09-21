# A Guide to React for FE developers

If our React walk through we're going to be using the React JavaScript library for quickly building really fast interfaces, Node and Express for our server and mock routes, Gulp for running tasks, and webpack as our package bundler.

This tutorial does not cover Flux/Reflux/Redux. Why? You probably don't need it for building small components and interfaces, and if you start building things using the parent/child data relationship that's built into react. It's better to learn how to "think react" instead of relying on Redux which has its tradeoffs. Come back to Redux if you find a real need for it. (I might cover Redux in a later guide.)

## Setting up the project:

```
mkdir react-base-project && cd react-base-project
git init
npm init
```

When you run `npm init` fill in the details however you see fit. In my case I used `server.js` as my `main` file, and this will be the server that serves static assets.

## webpack:

Let's go ahead and create a webpack configuration file. With webpack we can bundle up all of our assets into a single JS package, which reduces wait time by the browser and includes all of our CSS and images! In addition we can use a module loader such as CommonJS, RequireJS, AMD, Browserify or ES2015/ES6 Imports right inside our JS files, write your JS using latest (ES6, ES7 and beyond) standards/features and transpile it into any target JavaScript version you like, as well use any CSS preprocessors (Sass and Less, or pure css) and post-processors (never write a vendor prefix again!), images processors (do you like Data URIs?) or any other file loaders we like. Everything is embedded right into the JS file!

(You can optionally extract stylesheets into a css file, or export images instead of creating embedded data URIs if you like.)

Let's install webpack:

```
npm install webpack --global
npm install webpack --save-dev
```

Let's assume we have all of our app's source code inside `/src` and make a basic webpack configuration in `webpack.config.js`, we will build on it as we go.


```
module.exports = {
  context: __dirname + "/src",
  entry: "./app.js",

  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },
}
```

This tells webpack that our app is in the src directory and the entry point to our application is `app.js`. `app.js` will eventually require any other files it needs. We also tell webpack to output the resulting JavaScript in `dist/app.js`.

Make sure it works by adding the file `src/app.js` and putting a `console.log` into it, just to make sure everything works.

```
// app.js
console.log('Hello world!')
```

Run the bundler with `webpack -d`, and you should see the output file in `dist` including a map file.

### HTML Plugin

If we wanted we could manually create an `HTML` file, point a `script` tag to this file and host it with Node/Express. But, there is a webpack loader called `html-loader` that will automatically create this html file with the correct location of the `dist/app.js` bundle.  

Go ahead and install the plugin:

`npm install html-webpack-plugin --save-dev`

Now we have to add the plugin to our `webpack.config.js`:

```
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin()
  ]

```

This will generate a file `dist/index.html` containing the following:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  </head>
  <body>
    <script src="app.js"></script>
  </body>
</html>
```

This is only the most basic configuration, so review the github page. Sometimes I find it useful to use an HTML template instead, which will allow me to link to external resources or bower/npm packages without bundling them into my app. But this is not necessary for this demo. Open the file in the browser and check the console, you should see your `hello world!`.

In the output of the `webpack -d` command you'll see that it generates a hash, which we can use for cache busting. All you have to do is change the webpack.config.js file to include the hash:

```
module.exports = {
  context: __dirname + "/src",
  entry: "./app.js",

  output: {
    filename: "app.[hash].js",
    path: __dirname + "/dist",
  },
}
```
### Hashing

Run it again and you should see the updated file, such as `app.fb49124036ee11c26c35.js`, and updated script `src` attribute.

### webpack Dev Server

webpack also has a light weight development server that we’ll be using to serve the assets that it compiles. We’ll use this going forward so that we can see the results of our work in the browser.

```
npm install webpack-dev-server -g
npm install webpack-dev-server --save-dev
```

Now we can run `webpack-dev-server` from the terminal and visit http://localhost:8080 in our browser to view the results of our work.


This works and we can see our `console.log` when we open the console. However right now if you alter the contents of `app.js`, nothing happens until you refresh the page. Instead, we want webpack to recompile our application and reload the page. To do this, run the command with the following flags:

```
webpack-dev-server --progress --inline
```

`--progress` displays the compilation progress when building
`--inline` adds webpack's automatic refresh code inline with the compile application

This is a really clumsy thing to type, so let's add it as npm start:

```
// package.json

{
  ...
  "scripts": {
    "start": "webpack-dev-server --progress --inline"
  }
  ...
}

```

## Modules and Loaders

Because we're using the NodeJS native CommonJS `require`, we can use modules and require in any other JS files we like. But because we're using webpack we can load many other files including CSS and using *loaders*.

Loaders are transformations that are applied on a resource file of your app. They are functions (running in node.js) that take the source of a resource file as the parameter and return the new source.

For example, you can use loaders to tell webpack to load CoffeeScript or JSX.

Update your `webpack.config.js` to include some loaders:

```
module.exports = {
  ...
  module: {
    ...
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  }
}
```

This webpack config can load styles using `style-loader` which adds CSS to the DOM by injecting a <style> tag, the `css-loader` returns css, resolves imports and url(...), and is used along with the `url-loader` which embeds small png images as Data Urls and `file-loader` loads jpg images as files. The `test` is what matching files (using regex) should be loaded using this loader the `limit` is an example of a loader which takes parameters.

Loaders must be installed via NPM, so let's do that.

```
npm install style-loader css-loader url-loader file-loader --save-dev
```

Add a file `src/styles.css` and set `body { background-color: red; }` just to make it obvious that it works.

In order to get the styles to show up, you have to either make a custom HTML file, or add the css file to your HtmlWebpackPlugin (which handles the linking for you), both of which a second request and don't bundle your files for you.

Restart your server and in your `app.js` file add `require('./styles.css')`. Once the page loads it should be red!

### ES2015/ES6 Module

ES2015 (AKA ES6) seeks to unify module loader patterns, so instead of deciding between CommonJS, RequireJS, AMD or Browserify, we can just always use ES2015 Modules.

Instead of writing `var math = require('lib/math')` you use `import math from 'lib/math'`, or you can use the async model to prevent code execution until the requested modules are available and processed `import * as math from 'lib/math'` or even import individual named components from a module such as `import { sum, pi } from 'lib/math'`.

To add support for ES2015 we're going to use `babel-loader`. It has a few requirements, so lets install them:

```
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

Now go ahead and add the loader and we'll tell it to use the preset `es2015`, and to test `.js` files, but exclude node_modules and bower_components.

```
// webpack.config.js
module.exports = {
  ...
  module: {
    loaders: [
    ...
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
    }
```

Change `require('./styles.css')` to the following:

```
import './styles.css'
```

### Hot Module Replacement

By default `webpack-dev-server` will trigger a full page refresh. However we can use something called Hot Module Replacement, or HMR. HMR adds a small runtime to the bundle during the build process that runs inside your app and detects changes. It’s like LiveReload for every module.

It's smart too, because it detects which modules are required and which have changed. If the polling shows no changes needed, nothing happens. It also outputs really useful error messages on the page.

Lets set it up! First change the npm start script to include the `--hot` flag.

Secondly, push `'webpack/hot/dev-server'` to `entry`, and `new webpack.HotModuleReplacementPlugin()` to `plugins`.

`webpack/hot/dev-server` will reload the entire page if the HMR update fails. If you want to reload the page on your own, you can add `webpack/hot/only-dev-server` to the entry point instead.

```
// webpack.config.js
...
var webpack = require('webpack')

module.exports = {
  ...
  entry: [
    './app.js',
    'webpack/hot/dev-server'
  ],
  ...
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

## React:

Let's start off with a really dead simple app just to make sure our build process is working and React. Then we can start adding in pieces and tests as we go along. For now, let's just get a `p` tag on the page with a hello world.

First we have to add react to our babel loaders.

```
npm install babel-preset-react --save-dev
```

```
// webpack.config.js
module.exports = {
  ...
  module: {
    loaders: [
    ...
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
    }
```

And add react itself (Note that because React is required for our application to run, we’re using `--save `rather than `--save-dev`.):

```
npm install react react-dom --save
```

Now we can update our app.js file to be a super basic component that renders into the DOM using JSX.

> You don't have to use JSX and can just use plain JS. However, we recommend using JSX because it is a concise and familiar syntax for defining tree structures with attributes.

Read [this](https://facebook.github.io/react/docs/jsx-in-depth.html) to see why.

```
import { render } from 'react-dom';
import React from 'react';

render(
  <h1>
    This is a React test!
  </h1>,
  document.body
)
```

Run that and you should see the h1 load into your app! But, with the following warning:

> Warning: render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.

You shouldn't render react directly into the body. There are two things you can do to solve this.

1) Use a plain javascript object which you append to the body as your entry point:

```
var root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(
  <h1>Sherlock Holmes</h1>,
  root
)
```


2) Render into an existing HTML element:

This is more likely what you'll do, such as if you have an existing page that you want to render into.

Update your HtmlWebpackPlugin to use a template
```
// webpack.config.js
...

module.exports = {
  ...
  plugins: [
    ...
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      inject: 'body',
    })
  ],
  ...
}
```

Here `inject: 'body'` means that your JS will be injected into the template body before the closing tag. In production we would just link to the JS file there any way.

Then create an HTML page to serve as a template

```
// index.template.html
<!DOCTYPE html>
<html>
  <body>
    <div id="react-root"></div>
  </body>
</html>
```

Now update the JSX

```
// app.js
var root = document.getElementById('react-root')

ReactDOM.render(
  <h1>Sherlock Holmes</h1>,
  root
)
```









## Gulp

webpack can sometimes be limited because of how new it is, and with how ubiquitous Gulp tasks are you may want more fine grained build processes. Luckily because Gulp and webpack are just JS, it turns out that integrating Gulp into your webpack workflow is easy.
