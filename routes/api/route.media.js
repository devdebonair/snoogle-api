const Media = require("../../controllers").Media;

module.exports = (router) => {
	router.route("/media")
		.get((req, res) => {
			let media = new Media();
			media
			.fetch({ url: req.query.url })
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				return res.status(400).json({message: "Something went wrong."});
			});
		});
};