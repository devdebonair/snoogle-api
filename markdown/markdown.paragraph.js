let toString = require("mdast-util-to-string");
let types = require("./markdown.types");

module.exports = (tree, definitions) => {
	let type = "paragraph";
	let value = toString(tree);
	let meta = [];
	let visitedIndex = 0;
	for(let child of tree.children) {
		if(child.type === 'text'){
			continue;
		}
		let metaObj = {};
		metaObj.range = {};
		metaObj.type = child.type;
		let childValue = toString(child).trim();
		let startIndex = visitedIndex + value.substring(visitedIndex).indexOf(childValue);
		visitedIndex = startIndex;
		metaObj.range.start = startIndex;
		metaObj.range.end = metaObj.range.start + childValue.length;

		if(child.type === types.link) {
			metaObj.url = child.url;
		}

		if(child.type === types.linkReference) {
			let reference = definitions(child.identifier);
			if(reference) {
				metaObj.type = types.link;
				metaObj.url = reference.url;
			}
		}

		if(child.type === types.imageReference) {
			let reference = definitions(child.identifier);
			if(reference) {
				metaObj.type = types.image;
				metaObj.url = reference.url;
			}
		}

		meta.push(metaObj);
	}
	return {
		type: type,
		value: value,
		meta: meta
	};
};