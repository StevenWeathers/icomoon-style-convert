icomoon-style-convert
=====================

A Node.js Module to Convert [icomoon](https://icomoon.io/) icon font css styles to LESS file

Eventually will add Stylus and SCSS support

[![wercker status](https://app.wercker.com/status/bad55a5bf1bc385319d8b3cf109e29a7/m/master "wercker status")](https://app.wercker.com/project/bykey/bad55a5bf1bc385319d8b3cf109e29a7)
[![Coverage Status](https://img.shields.io/coveralls/StevenWeathers/icomoon-style-convert.svg)](https://coveralls.io/r/StevenWeathers/icomoon-style-convert)
[![Dependency Status](https://david-dm.org/stevenweathers/icomoon-style-convert.png)](https://david-dm.org/stevenweathers/icomoon-style-convert)

### Install

```
npm install --save-dev icomoon-style-convert
```


### Example Usage

```js
var icomoonconvert = require("icomoon-style-convert");
var fs = require('fs');
var css = fs.readFileSync("style.css","utf-8");

fs.writeFileSync('style.less', icomoonconvert.less(css));
```

### Example Usage with Prefix Option

```js
var icomoonconvert = require("icomoon-style-convert");
var fs = require('fs');
var css = fs.readFileSync("style.css","utf-8");

var options = {
	classPrefix: "sw-"
};

fs.writeFileSync('style.less', icomoonconvert.less(css,options));
```
