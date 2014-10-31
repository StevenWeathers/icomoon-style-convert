var _ = require('lodash');

var variablesFromCss = function(css, options){
    var abstractedVariables = {};

    // icomoon settings
    var classPrefix = (options.classPrefix) ? options.classPrefix : "icon-";
    // @todo add postfix option

    // find the font-face
    var fontFaceExpression = "(@font-face\\s\\{(\\s*?.*?)*?\\})";
    var fontFaceRegex = new RegExp(fontFaceExpression, "igm");
    var fontFace = css.match(fontFaceRegex);
    // find the font-family
    abstractedVariables.fontFamily = fontFace[0].match(/(\'.*\')/igm)[0];
    // find the font-buster
    abstractedVariables.fontBuster = fontFace[0].match(/(\?(.*)\')/igm)[0].replace("?","").replace("'","");

    // find the icons
    var iconsExpression = "(\\."+classPrefix+".*\\s\\{[\\s\\S].*[\\s\\S]\\})+";
    var iconsRegex = new RegExp(iconsExpression, "igm");
    var iconsFound = css.match(iconsRegex);
    var icons = [];
    // find the icon name
    var singleIconExpression = "("+classPrefix+".*(?=\\:))+";
    var singleIconRegex = new RegExp(singleIconExpression,"ig");
    // find the icon content
    var iconContentExpression = "(\".*\")+";
    var iconContentRegex = new RegExp(iconContentExpression,"ig");

    _(iconsFound).forEach(function(icon) {
        icons.push({
            iconName: icon.match(singleIconRegex)[0],
            iconContent: icon.match(iconContentRegex)[0]
        });
    });

    abstractedVariables.icons = icons;

    return abstractedVariables;
};

// @todo add error catching for cases where prefix doesn't match css
var cssToLess = function(css, options){
    if (!css) {
        throw new Error("Need to pass css");
    }

    // icomoon settings
    var classPrefix = (options.classPrefix) ? options.classPrefix : "icon-";
    // @todo add postfix option
    
    var abstractedVariables = variablesFromCss(css, options);
    
    // build the font-face less
    var fontFaceLess = "@font-face {\n\tfont-family: '@{"+classPrefix+"font-family}';\n\tsrc:url('fonts/@{"+classPrefix+"font-family}.eot?@{"+classPrefix+"font-buster}');\n\tsrc:url('fonts/@{"+classPrefix+"font-family}.eot?#iefix@{"+classPrefix+"font-buster}') format('embedded-opentype'),\n\t\turl('fonts/@{"+classPrefix+"font-family}.woff?@{"+classPrefix+"font-buster}') format('woff'),\n\t\turl('fonts/@{"+classPrefix+"font-family}.ttf?@{"+classPrefix+"font-buster}') format('truetype'),\n\t\turl('fonts/@{"+classPrefix+"font-family}.svg?@{"+classPrefix+"font-buster}#@{"+classPrefix+"font-family}') format('svg');\n\tfont-weight: normal;\n\tfont-style: normal;\n}";
    // build the font icon styles
    var fontIconStyles = "." + classPrefix + "font-styles(){\n\tfont-family: '@{"+classPrefix+"font-family}';\n\tspeak: none;\n\tfont-style: normal;\n\tfont-weight: normal;\n\tfont-variant: normal;\n\ttext-transform: none;\n\tline-height: 1;\n\n\t// Better Font Rendering\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n}";
    // build the font icon selector styles
    var fontIconSelector = "[class^=\"" + classPrefix + "\"], [class*=\" " + classPrefix + "\"] {\n\t." + classPrefix + "font-styles();\n}";

    var iconsLess = "";
    var iconFontVariables = [];
    var iconsVariablesLess = [];
    var iconsClassLess = [];

    iconFontVariables.push("@" + classPrefix + "font-family: " + abstractedVariables.fontFamily + ";");
    iconFontVariables.push("@" + classPrefix + "font-buster: " + abstractedVariables.fontBuster + ";");

    _(abstractedVariables.icons).forEach(function(icon) {
        iconsVariablesLess.push("@" + icon.iconName + ": " + icon.iconContent + ";");
        iconsClassLess.push("." + icon.iconName + ":before {\n\tcontent: @" + icon.iconName + ";\n}");
    });

    iconsLess = "// file generated do not manually edit\n\n" + iconFontVariables.join("\n") + "\n\n" + iconsVariablesLess.join("\n") + "\n\n" + fontFaceLess + "\n\n" + fontIconStyles + "\n\n" + fontIconSelector + "\n\n" + iconsClassLess.join("\n");

    return iconsLess;
};

// @todo add Stylus support
// @todo add SCSS support
module.exports = {
    less: function(css, options){
        if (!options){
            var options = {};
        }
        var less = cssToLess(css, options);
        return less;
    }
}