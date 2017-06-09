let toString = require("mdast-util-to-string");

module.exports = (tree) => {
	return {
		type: "blockquote",
		value: toString(tree)
	};
};