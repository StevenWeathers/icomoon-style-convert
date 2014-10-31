var fs = require('fs');
var Q = require('q');
var _ = require('lodash');


var icoCssFile = "test/style.css";

// icomoon settings
var classPrefix = "icon-";
var classPostFix = "";
// find the icons
var iconsExpression = "(\\."+classPrefix+".*"+classPostFix+"\\s\\{[\\s\\S].*[\\s\\S]\\})+";
var iconsRegex = new RegExp(iconsExpression, "igm");
// find the icon name
var singleIconExpression = "("+classPrefix+".*(?=\\:))+";
var singleIconRegex = new RegExp(singleIconExpression,"ig");
// find the icon content
var iconContentExpression = "(\".*\")+";
var iconContentRegex = new RegExp(iconContentExpression,"ig");
// find the font-face
var fontFaceExpression = "(@font-face\\s\\{(\\s*?.*?)*?\\})";
var fontFaceRegex = new RegExp(fontFaceExpression, "igm");

var buildLessFile = function(css){
    var iconsLess = "";
    var iconFontVariables = [];
    var iconsVariablesLess = [];
    var iconsClassLess = [];
    var icons = css.match(iconsRegex);
    var fontFace = css.match(fontFaceRegex);
    var fontFamily = fontFace[0].match(/(\'.*\')/igm)[0];
    var fontBuster = fontFace[0].match(/(\?(.*)\')/igm)[0].replace("?","").replace("'","");
    var fontFaceLess = "@font-face {\n\tfont-family: '@{"+classPrefix+"font-family}';\n\tsrc:url('fonts/@{"+classPrefix+"font-family}.eot?@{"+classPrefix+"font-buster}');\n\tsrc:url('fonts/@{"+classPrefix+"font-family}.eot?#iefix@{"+classPrefix+"font-buster}') format('embedded-opentype'),\n\t\turl('fonts/@{"+classPrefix+"font-family}.woff?@{"+classPrefix+"font-buster}') format('woff'),\n\t\turl('fonts/@{"+classPrefix+"font-family}.ttf?@{"+classPrefix+"font-buster}') format('truetype'),\n\t\turl('fonts/@{"+classPrefix+"font-family}.svg?@{"+classPrefix+"font-buster}#@{"+classPrefix+"font-family}') format('svg');\n\tfont-weight: normal;\n\tfont-style: normal;\n}";
    var fontIconStyles = "." + classPrefix + "font-styles(){\n\tfont-family: '@{"+classPrefix+"font-family}';\n\tspeak: none;\n\tfont-style: normal;\n\tfont-weight: normal;\n\tfont-variant: normal;\n\ttext-transform: none;\n\tline-height: 1;\n\n\t// Better Font Rendering\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n}";
    var fontIconSelector = "[class^=\"" + classPrefix + "\"], [class*=\" " + classPrefix + "\"] {\n\t." + classPrefix + "font-styles();\n}";

    iconFontVariables.push("@" + classPrefix + "font-family: " + fontFamily + ";");
    iconFontVariables.push("@" + classPrefix + "font-buster: " + fontBuster + ";");

    _(icons).forEach(function(icon) {
        var iconName = icon.match(singleIconRegex)[0];
        var iconContent = icon.match(iconContentRegex)[0];

        iconsVariablesLess.push("@" + iconName + ": " + iconContent + ";");
        iconsClassLess.push("." + iconName + ":before {\n\tcontent: @" + iconName + ";\n}");
    });

    iconsLess = "// file generated do not manually edit\n\n" + iconFontVariables.join("\n") + "\n\n" + iconsVariablesLess.join("\n") + "\n\n" + fontFaceLess + "\n\n" + fontIconStyles + "\n\n" + fontIconSelector + "\n\n" + iconsClassLess.join("\n");

    return iconsLess;
};

Q.nfcall(fs.readFile, icoCssFile, "utf-8")
.then(buildLessFile)
.then(function(iconsLess){
    return Q.nfapply(fs.writeFile, ["test/icons.less", iconsLess]);
})
.catch(function (error) {
    // Handle any error from all above steps
    console.log(error);
})
.done(function(){
    console.log("icon-variables.less Created.");
});