icomoon-style-convert
=====================

A Node.js Module to Convert [icomoon](https://icomoon.io/) icon font css styles to LESS file

Eventually will add Stylus and SCSS support

### Install

```
npm install --save-dev icomoon-style-convert
```


### Example Usage

```js
var icomoonconvert = require("icomoon-style-convert");
var fs = require('fs');
var css = fs.readFileSync("style.css","utf-8");

icomoonconvert.less(css);
```

### Example Usage with Prefix Option

```js
var icomoonconvert = require("icomoon-style-convert");
var fs = require('fs');
var css = fs.readFileSync("style.css","utf-8");

var options = {
	classPrefix: "sw-"
};

icomoonconvert.less(css, options);
```