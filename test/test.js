var assert = require("assert");
var fs = require('fs');
var icomoonconvert = require("../index.js");

var icoCss = fs.readFileSync("test/style.css","utf-8");
var icoLess = fs.readFileSync("test/style.less","utf-8");

var icoPrefixedCss = fs.readFileSync("test/prefixed-style.css","utf-8");
var icoPrefixedLess = fs.readFileSync("test/prefixed-style.less","utf-8");

describe('icomoon-style-convert', function(){
	describe('passing css', function(){
		it('should be converted to less', function(){
			assert.equal(icoLess, icomoonconvert.less(icoCss));
		});
	});

	describe('passing no css', function(){
		it('should throw "Need to pass css" error', function(){
			assert.throws(icomoonconvert.less, Error, "Need to pass css");
		});
	});

	describe('passing css with prefix option', function(){
		it('should be converted to less', function(){
			var options = {
				classPrefix: "sw-"
			};
			assert.equal(icoPrefixedLess, icomoonconvert.less(icoPrefixedCss, options));
		});
	});
});