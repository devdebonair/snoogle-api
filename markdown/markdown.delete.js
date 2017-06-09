let toString = require("mdast-util-to-string");

module.exports = (tree) => {
	return {
		type: "delete",
		value: toString(tree)
	};
};