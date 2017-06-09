let toString = require("mdast-util-to-string");

module.exports = (tree) => {
	return {
		type: "emphasis",
		value: toString(tree)
	};
};