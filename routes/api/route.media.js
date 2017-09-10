const Miner = require("../../miner");

module.exports = (router) => {
	router.route("/media")
		.get((req, res) => {
			let miner = new Miner();
			miner
			.fetch(req.query.url)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				return res.status(400).json({message: "Something went wrong."});
			});
		});
};