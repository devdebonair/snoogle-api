let toString = require("mdast-util-to-string");

module.exports = (tree) => {
	return {
		type: "link",
		value: toString(tree),
		url: tree.url
	};
};