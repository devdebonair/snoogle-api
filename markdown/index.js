let parseHeading = require("./markdown.heading");
let parseStrong = require("./markdown.strong");
let parseLink = require("./markdown.link");
let parseEmphasis = require("./markdown.emphasis");
let parseDelete = require("./markdown.delete");
let parseCode = require("./markdown.code");
let parseParagraph = require("./markdown.paragraph");
let parseBlockQuote = require("./markdown.blockquote");
let parseImage = require("./markdown.image");
let types = require("./markdown.types");
let fetchDefinitions = require("mdast-util-definitions");

module.exports = (tree) => {
	let blocks = [];
	let children = tree.children;
	let definitions = fetchDefinitions(tree);
	for(let child of children) {
		if(child.type === types.heading) {
			blocks.push(parseHeading(child));
		}
		if(child.type === types.strong) {
			blocks.push(parseStrong(child));
		}
		if(child.type === types.link) {
			blocks.push(parseLink(child));
		}
		if(child.type === types.emphasis) {
			blocks.push(parseEmphasis(child));
		}
		if(child.type === types.delete) {
			blocks.push(parseDelete(child));
		}
		if(child.type === types.code) {
			blocks.push(parseCode(child));
		}
		if(child.type === types.paragraph) {
			blocks.push(parseParagraph(child, definitions));
		}
		if(child.type === types.blockQuoute) {
			blocks.push(parseBlockQuote(child));
		}
		if(child.type === types.image) {
			blocks.push(parseImage(child));
		}
	}
	return blocks;
};