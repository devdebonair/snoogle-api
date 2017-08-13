const Subreddit = require("../../controllers").Subreddit;
const account = require("../../config").reddit;
const Cache = require("../../cache").shared;
const _ = require("lodash");
const paginate = require("../../helpers/helper.listing").paginate;

module.exports = (router) => {
	router.route("/swag")
		.get((req, res) => {
			console.log("redirecting");
			return res.redirect("snoogle://reddit/auth");
		});

    router.route("/frontpage/:sort")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            let options = { sort: req.params.sort, after: req.query.after };
            subreddit.getListing(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            let options = {subreddit: req.params.name};
            subreddit.fetch(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/listing/:sort")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            const after = req.query.after;
            let options = {subreddit: req.params.name, sort: req.params.sort, after: after};

            return subreddit.getListing(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                console.log(error);
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/subscribe")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            let options = {subreddit: req.params.name};
            subreddit.subscribe(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/unsubscribe")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            let options = {subreddit: req.params.name};
            subreddit.unsubscribe(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/submit/text")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            const options = { title: req.body.title, text: req.body.text, subreddit: req.params.name };
            subreddit.submitText(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/submit/link")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const subreddit = new Subreddit(accountOptions);
            const options = { title: req.body.title, url: req.body.url, subreddit: req.params.name };
            subreddit.submitLink(options)
            .then(data => {
            	return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/activity")
    	.get((req, res) => {
    		let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
    		const subreddit = new Subreddit(accountOptions);
    		const options = { subreddit: req.params.name };
    		subreddit.fetchActivity(options)
    		.then(data => {
            	return res.status(200).json(data);
            })
    		.catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
    	});
};
