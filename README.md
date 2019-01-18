# babel-plugin-chevrotain-serialize

This plugin finds class declarations which inherit from `chevrotain.Parser`, serializes them, and passes this serialization into their constructor `super` calls, allowing your code to bypass parser grammar construction at runtime. This is especially useful if you run your code through a minifier, as you’ll no longer have to avoid mangling token names.

## Installation

```
npm install --save-dev babel-plugin-chevrotain-serialize
```

or

```
yarn add --dev babel-plugin-chevrotain-serialize
```

## Usage

Add the plugin to your .babelrc.

```json
{
  "plugins": ["babel-plugin-chevrotain-serialize"]
}
```

## How it works

1. It finds `Parser` imports which are imported using any of the methods shown below
2. It finds any class that inherits from the `Parser` class
3. If no classes inherit from `Parser`, no transform is done - this allows modules to import or require `chevrotain` without being transformed
4. If a module contains a class which contains a class that inherits from `Parser`, the module is loaded using `require-from-string` and each `Parser` class is used to generate a serialized grammar
5. The serialized grammar is then added as a config property named `serializedGrammar`

## Import/Require methods

The plugin will find `Parser` references which are imported and referenced in any of the following ways:

```javascript
// method 1
import { Parser } from "chevrotain";
// method 2
const { Parser } = require("chevrotain");
// method 1 & 2 reference
class MyParser extends Parser {}

// method 3
import * as chevrotain from "chevrotain";
// method 4
import chevrotain from "chevrotain";
// method 5
const chevrotain = require("chevrotain");
// method 3, 4 & 5 reference
class MyParser extends chevrotain.Parser {}

// will not work
const Parser1 = Parser;
// this will not be detected
class MyParser extends Parser1 {}
```

## Limitations

Since any modules with `Parser` class must be loaded using `require-from-string`, it must be valid javascript loadable in node. This might require your babel config to contain a module plugin, such as `@babel/plugin-transform-modules-commonjs` to transform unsupported syntax like:

```
import { Parser } from 'chevrotain';
```
