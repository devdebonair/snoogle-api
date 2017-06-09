let toString = require("mdast-util-to-string");

module.exports = (tree) => {
	return {
		type: "strong",
		value: toString(tree)
	};
};