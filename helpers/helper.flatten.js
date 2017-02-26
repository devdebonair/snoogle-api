const _ = require("lodash");

module.exports = function flatten(treeObj, idAttr, parentAttr, childrenAttr, levelAttr) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent_id';
    if (!childrenAttr) childrenAttr = 'replies';
    if (!levelAttr) levelAttr = 'level';
    function flattenChild(childObj, parentId, level) {
        var array = [];

        var childCopy = _.extend({}, childObj);
        childCopy[levelAttr] = level - 1;
        childCopy[parentAttr] = parentId;
        delete childCopy[childrenAttr];
        array.push(childCopy);

        array = array.concat(processChildren(childObj, level));

        return array;
    }
    function processChildren(obj, level) {
        if (!level) level = 0;
        var array = [];
        obj[childrenAttr].forEach(function(childObj) {
            array = array.concat(flattenChild(childObj, obj[idAttr], level+1));
        });

        return array;
    }
    var result = processChildren(treeObj);
    return result;
};
