module.exports = (tree) => {
	return {
		type: "code",
		value: tree.value,
		lang: tree.lang
	};
};