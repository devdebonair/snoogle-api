let toString = require("mdast-util-to-string");

module.exports = (tree) => {
	return {
		type: "heading",
		depth: tree.depth,
		value: toString(tree)
	};
};