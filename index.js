var _ = require('lodash');
var swig = require('swig');
swig.setDefaults({ varControls: ['<%=', '%>'] });

var variablesFromCss = function(css, options){
    var abstractedVariables = {};

    // icomoon settings
    var classPrefix = (options.classPrefix) ? options.classPrefix : "icon-";
    abstractedVariables.classPrefix = classPrefix;
    // @todo add postfix option

    // find the font-face
    var fontFaceExpression = "(@font-face\\s\\{(\\s*?.*?)*?\\})";
    var fontFaceRegex = new RegExp(fontFaceExpression, "igm");
    var fontFace = css.match(fontFaceRegex);
    // find the font-family
    abstractedVariables.fontFamily = fontFace[0].match(/(\'.*\')/igm)[0].replace(/\'/g, "\"");
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

    var abstractedVariables = variablesFromCss(css, options);

    return swig.renderFile('templates/less.html', abstractedVariables);
};

// @todo add Stylus support
// @todo add SCSS support
module.exports = {
    less: function(css, options){
        if (typeof options != "object"){
            options = {};
        }
        var less = cssToLess(css, options);
        return less;
    }
};