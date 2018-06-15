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

The plugin will find `Parser` references which are imported and referenced in one of four ways.
```javascript
// method 1
import { Parser } from "chevrotain";
// method 2
const { Parser } = require("chevrotain");
// method 1 & 2 reference
class MyParser extends Parser {
}
// method 3
import * as chevrotain from "chevrotain";
// method 4
const chevrotain = require("chevrotain");
// method 3 & 4 reference
class MyParser extends chevrotain.Parser {
}
// will not work
const Parser1 = Parser;
// this will not be detected
class MyParser extends Parser1 {
}
```
