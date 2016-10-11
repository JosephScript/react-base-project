# A Guide to React using Webpack for FE developers

In this React walk through we're going to be using the React JavaScript library for quickly building really fast interfaces, Webpack as our package bundler and to run our development server. Then we'll create a testing suite using Enzyme and Mocha. You can easily substitute Mocha with any other testing framework (Sinon, Jasmine, etc.).

This tutorial does not cover Flux/Reflux/Redux. Why? You probably don't need it for building small components and interfaces, and if you start building things using the parent/child data relationship that's built into react. It's better to learn how to "think react" instead of relying on Redux which has its tradeoffs. Come back to Redux if you find a real need for it. (I might cover Redux in a later guide.)

## Setting up the project:

```
mkdir react-base-project && cd react-base-project
git init
npm init
```

When you run `npm init` fill in the details however you see fit. For example you can use `index.js` as your main Node file, and this will be the server that serves static assets, or maybe acts as your API server (check out how to proxy below).

## Webpack:

Let's go ahead and create a Webpack configuration file. With Webpack we can bundle up all of our assets into a single JS package, which reduces wait time by the browser and includes all of our CSS and images! In addition we can use a module loader such as CommonJS, RequireJS, AMD, Browserify or ES2015/ES6 Imports right inside our JS files, write your JS using latest (ES6, ES7 and beyond) standards/features and transpile it into any target JavaScript version you like, as well use any CSS preprocessors (Sass and Less, or pure css) and post-processors (never write a vendor prefix again!), images processors (do you like Data URIs?) or any other file loaders we like. Everything is embedded right into the JS file!

(You can optionally extract stylesheets into a css file, or export images instead of creating embedded data URIs if you like.)

Let's install Webpack:

```
npm install webpack --global
npm install webpack --save-dev
```

Let's assume we have all of our app's source code inside `/src` and make a basic webpack configuration in `webpack.config.js`, we will build on it as we go.

``` JavaScript
module.exports = {
  context: __dirname + '/src',
  entry: './app.js',

  output: {
    filename: 'app.js',
    path: __dirname + '/dist',
  },
}
```

This tells webpack that our app is in the src directory and the entry point to our application is `app.js`. `app.js` will eventually require any other files it needs. We also tell webpack to output the resulting JavaScript in `dist/app.js`.

Make sure it works by adding the file `src/app.js` and putting a `console.log` into it, just to make sure everything works.

``` JavaScript
// app.js
console.log('Hello world!')
```

Run the bundler with `webpack -d`, and you should see the output file in `dist` including a map file.

### HTML Plugin

If we wanted we could manually create an `HTML` file, point a `script` tag to this file and host it with Node/Express. But, there is a webpack loader called `html-loader` that will automatically create this html file with the correct location of the `dist/app.js` bundle.

Go ahead and install the plugin:

`npm install html-webpack-plugin --save-dev`

Now we have to add the plugin to our `webpack.config.js`:

``` JavaScript
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin()
  ]

```

This will generate a file `dist/index.html` containing the following:

``` HTML
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

``` JavaScript
module.exports = {
  context: __dirname + '/src',
  entry: './app.js',

  output: {
    filename: 'app.[hash].js',
    path: __dirname + '/dist',
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

``` JSON
// package.json

{
  ...
  "scripts": {
    "start": "webpack-dev-server --progress --inline"
  }
  ...
}

```

### Proxy

The Webpack dev server makes use of `http-proxy-middleware` to optionally proxy requests to a separate, possibly external, backend server.

```
// webpack.config.js
{
  devServer: {
    ...
    proxy: {
      '/api': {
        target: 'https://other-server.example.com/api',
        secure: false
      }
    }
  }
  ...
}
```

The proxy can be bypassed based on the return from a function, and the request to the proxy can be rewritten by providing a function.

## Modules and Loaders

Because we're using the NodeJS native CommonJS `require`, we can use modules and require in any other JS files we like. But because we're using webpack we can load many other files including CSS and using *loaders*.

Loaders are transformations that are applied on a resource file of your app. They are functions (running in node.js) that take the source of a resource file as the parameter and return the new source.

For example, you can use loaders to tell webpack to load CoffeeScript or JSX.

Update your `webpack.config.js` to include some loaders:

``` JavaScript
module.exports = {
  ...
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ]
  }
}
```

This webpack config can load styles using `style-loader` which adds CSS to the DOM by injecting a `<style>` tag, the `css-loader` returns css, resolves imports and url(...), and is used along with the `url-loader` which embeds small png images as Data Urls and `file-loader` loads jpg images as files. The `test` is what matching files (using regex) should be loaded using this loader the `limit` is an example of a loader which takes parameters.

Loaders must be installed via NPM, so let's do that.

```
npm install style-loader css-loader url-loader file-loader --save-dev
```

Add a file `src/styles.css` and set `body { background-color: red; }` just to make it obvious that it works.

In order to get the styles to show up, you have to either make a custom HTML file, or add the css file to your HtmlWebpackPlugin (which handles the linking for you), both of which a second request and don't bundle your files for you.

In your `app.js` file add `require('./styles.css')`. Once the page loads it should be red!

### ES2015/ES6 Module

ES2015 (AKA ES6) seeks to unify module loader patterns, so instead of deciding between CommonJS, RequireJS, AMD or Browserify, we can just always use ES2015 Modules.

Instead of writing `var math = require('lib/math')` you use `import math from 'lib/math'`, or you can use the async model to prevent code execution until the requested modules are available and processed `import * as math from 'lib/math'` or even import individual named components from a module such as `import { sum, pi } from 'lib/math'`.

To add support for ES2015 we're going to use `babel-loader`. It has a few requirements, so lets install them:

```
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

Now go ahead and add the loader and we'll tell it to use the preset `es2015`, and to test `.js` files, but exclude node_modules and bower_components.

``` JavaScript
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

By default `webpack-dev-server` will trigger a full page refresh. However we can use something called Hot Module Replacement, or HMR. HMR adds a small runtime to the bundle during the build process that runs inside your app and detects changes. It’s like LiveReload for every module, thus HMR is faster because it updates code in-place without refreshing.

It's smart too, because it detects which modules are required and which have changed. If the polling shows no changes needed, nothing happens.

Add `--hot` to your npm start script. Nothing more is needed. This does all the relevant work automatically. The CLI of the `webpack-dev-server` automatically adds the special `webpack/hot/dev-server` entry point to your configuration.

So your start script should be :

```
"start": "webpack-dev-server --progress --inline --hot"
```

Just navigate to `http://«host»:«port»/«path»` and let the magic happen.

You should see the following messages in the browser log:

```
[HMR] Waiting for update signal from WDS...
[WDS] Hot Module Replacement enabled.
```

See [here](http://webpack.github.io/docs/webpack-dev-server.html#hot-module-replacement) for more details.

If you insted want to use an express/node webpack server as middleware, check out (webpack-hot-middleware)[https://github.com/glenjamin/webpack-hot-middleware].

## React:

Let's start off with a really dead simple app just to make sure our build process is working and React. Then we can start adding in pieces and tests as we go along. For now, let's just get a `p` tag on the page with a hello world.

First we have to add react to our babel loaders. In addition to enable HMR for React, we need to add the appropriate React tools to compile the modules with HMR support.


```
npm install babel-preset-react babel-preset-react-hmre --save-dev
```

``` JavaScript
// webpack.config.js
module.exports = {
  ...
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'react-hmre']
      },
      ...
```

And add react itself (Note that because React is required for our application to run, we’re using `--save `rather than `--save-dev`.):

```
npm install react react-dom --save
```

Now we can update our app.js file to be a super basic component that renders into the DOM using JSX. (Note: The .jsx extension is optional. If you decide to use .jsx make sure you update the loader accordingly.) JSX writes very similarly to HTML, and you can write any HTML entities you like.

> You don't have to use JSX and can just use plain JS. However, we recommend using JSX because it is a concise and familiar syntax for defining tree structures with attributes.

Read [this](https://facebook.github.io/react/docs/jsx-in-depth.html) to see why.


``` JavaScript
import { render } from 'react-dom'
import React from 'react'

render(
  <h1>
    Hello, World!
  </h1>,
  document.body
)
```

Run that and you should see the h1 load into your app! But, with the following warning:

> Warning: render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.

You shouldn't render react directly into the body. There are two things you can do to solve this.

1) Use a plain javascript object which you append to the body as your entry point:


``` JavaScript
import { render } from 'react-dom'
var root = document.createElement('div')
document.body.appendChild(root)

render(
  <h1>
    Hello, World!
  </h1>,
  root
)
```

2) Render into an existing HTML element:

This is more likely what you'll do, such as if you have an existing page that you want to render into.

Update your HtmlWebpackPlugin to use a template

``` JavaScript
// webpack.config.js
...

module.exports = {
  ...
  plugins: [
    ...
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      inject: 'body'
    })
  ],
  ...
}
```

Here `inject: 'body'` means that your JS will be injected into the template body before the closing tag. In production we would just link to the JS file there any way.

Then create an HTML page to serve as a template:

``` HTML
// index.template.html
<!DOCTYPE html>
<html>
  <body>
    <div id="react-root"></div>
  </body>
</html>
```

Now update the JSX to use the root div instead:

``` JavaScript
// app.js
import { render } from 'react-dom'
var root = document.getElementById('react-root')

render(
  <h1>
    Hello, World!
  </h1>,
  root
)
```

### Components

React is component-focused, and components are the primary structure of React. Data flows through React from parent to child components, so you do not have to deal with confusing two-way data-flow. In addition, child components only have access to data their parents explicitly pass down to them, further decoupling them from each other.

Let's build a more realistic React app and split it up into components.

Create a new file, `src/components/greeting.js`

``` JavaScript
import React from 'react'

export default class Greeting extends React.Component {
  render () {
    return (
      <h1 className='greeting'>Hello, {this.props.name}!</h1>
    )
  }
}
```

Here you can see we're using `React.Component` which is an ES6 class. `export` is used to make it a JS Module. Inside the class is `render` which is a function that returns some JSX. `this.props` is an object that contains any properties passed to it from it's parent. Finally, because `class` is a reserved word in JS we're JSX uses `className` instead. This is a common mistake to watch out for!

We can update our CSS to confirm this:

``` CSS
.greeting {
  color: red;
}

```

Note: You can also use `React.createClass` instead of `React.Component`, but it has a different syntax. I prefer the ES6 syntax, which uses less React boilerplate and more JavaScript. createClass refers to JS classes, not CSS classes.

Now update our `app.js` to render our new component.

``` JavaScript
import './styles.css'
import React from 'react'
import { render } from 'react-dom'
import Greeting from './components/greeting'

var root = document.createElement('div')
document.body.appendChild(root)

render(
  <Greeting name='World' />,
  root
)
```

We simply import the component as a module, and render it the same as we would any HTML, except we use our `Greeting` class name specifically. In addition, we can pass any `props` we like to the child. Since the child is expecting a `name` prop, we're passing in `name="World"` which looks and feels just like HTML!

Because we're using ES6 classes, we also have access to the constructor of our `Greeting` class. If you want to do some kind of work on the class when it's created, add the `constructor` function. Optionally, you can access the child's `props` here. If you want to use `props` inside the constructor you must pass them to `super`.

``` JavaScript
export default class Greeting extends React.Component {
  constructor() {
    super()
    console.log('We can do stuff here!')
  }
  ...
}
```

Here's an example where we are accessing `props` (note `props` are read only)

``` JavaScript
// accessing props
export default class Greeting extends React.Component {
  constructor(props) {
    super(props)
    var name = 'Foo ' + props.name
    console.log(name)
  }
  ...
}
```

### Synthetic Events/Event Handling

Because `props` are read only, there is an object called `state` that we have access to, and can notify the application when it is updated. Components are just state machines. You can also write in interactivity with Synthetic Events and Event Handling. In combination, these allow you to build truly interactive web applications quickly. There are a large number of Synthetic Events to which you can bind https://facebook.github.io/react/docs/events.html.

I'm going to add an example to our Greeting component so that it has some user interactivity.


``` JavaScript
export default class Greeting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }
  ...
}
```

Now let's update the JSX to include a text box, which runs an Event Handler when the Synthetic Event `onChange` is triggered.

``` JavaScript
...
  render () {
    return (
      <div>
        <h1 className='greeting'>Hello, {this.state.name || this.props.name}!</h1>
        <input type='text' placeholder='Enter your name' onChange={this.handleChange} />
      </div>
    )
  }
...
```

And finally, the handleChange function.

```
...
  handleChange (event) {
    this.setState({
      name: event.target.value
    })
  }
  render () {
...
```

The `setState` function notifies the DOM of the change of state, updating the DOM so that when the user types in the text box, the h1 will display their text. This is a super basic example, but with this basic understanding of how data flows from Synthetic Events to Event Handlers, to State is the majority of the work when building React apps.

Some important thing to note about state:

1) Never copied data from `props` to `state`.
2) Never mutate this.state directly (after construction), as calling setState afterwards could replace any mutations you made. Treat state as if it were immutable.
3) Calling setState will trigger a re-render (unless conditional logic is implimented in `shouldComponentUpdate()`).

## Testing

Install the testing tools `enzyme`, `mocha`, `chai`, `chai-enzyme`, `jsdom`, and `react-addons-test-utils`. Enzyme needs `react-addons-test-utils` and `jsdom` for some of its functionality in the way we will be using it.

```
npm install --save-dev enzyme mocha chai chai-enzyme jsdom react-addons-test-utils
```

### jsdom

According to the enzyme docs:

> JSDOM is a JavaScript based headless browser that can be used to create a realistic testing environment.

In the following script we're setting up babel, adding chai with enzyme support, and creating a dom in which to simulate a browser environment.

```
// setup.js
require('babel-register')()

var chai = require('chai')
var chaiEnzyme = require('chai-enzyme')

chai.use(chaiEnzyme())

var jsdom = require('jsdom').jsdom

var exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
```

We also need to tell babel which plugins to use. Create a .babelrc file and add the following:

```
{
  "presets": [
     "react",
     "es2015"
  ]
}
```

In our package.json file we can set up our tests, and pass in the setup file:

```
"scripts": {
  "test": "mocha setup.js src/**/*.spec.js"
  ...
```

Now that we have completely finished setting up our tools, we can get to writing some tests.

Let's write a really simple test to ensure our Greeting component loads. We have an example that shows how to test DOM content, one that shows how to test props, and how to test props of the component upon initialization.

We're running some tests with `shallow` and one with `mount`. Shallow is a 'real' unit test (isolation, no children render). `render` is full DOM rendering, which is ideal for use cases where you have components that may interact with DOM APIs, or may require the full lifecycle in order to fully test the component. There is also `static`, and I find as a good rule of thumb that if you want to test children rendering with less overhead than `mount` and you are not interested in lifecycle methods, use static.

See [enzyme](https://github.com/airbnb/enzyme) for more information.

```
import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Greeting from './greeting'

describe('<Greeting/>', function () {
  it('should have an `h1` to display a greeting', function () {
    const wrapper = shallow(<Greeting />)
    expect(wrapper.find('h1')).to.have.length(1)
  })

  it('should have no `props` for name', function () {
    const wrapper = shallow(<Greeting />)
    expect(wrapper.props().name).to.be.undefined
  })

  it('should have `props` for name', function () {
    const wrapper = mount(<Greeting name='World' />)
    expect(wrapper.props().name).to.equal('World')
  })
})
```

Finally, we can run a test to see what happens!

```
$ npm test
> mocha setup.js src/**/*.spec.js

  <Greeting/>
    ✓ should have an `h1` to display a greeting
    ✓ should have no `props` for name
    ✓ should have `props` for name

  2 passing (18ms)
```

Let's add a functional test:

```
...
it('typing in box should update state', function () {
  const wrapper = shallow(<Greeting/>)
  wrapper.find('input').simulate('change', {target: {value: 'Bilbo'}})
  expect(wrapper.state('name')).to.equal('Bilbo')
})
```

Here you can see that we're not only simulating an input change, but also then checking that `state` updated as it should.

With the ability to test the DOM, `props` and `state`, as well as simulating Synthetic Events, this testing framework becomes very flexable.

## Next Steps

So far this is just a very basic introduction into Webpack and React that relies heavily on the command line tools. I would like to continue building out a full example project that goes beyond the command line basics of Webpack to include an Express server and proxy for local testing against APIs, create a sample React project structure, and illustrate more complex data flows inside React.
