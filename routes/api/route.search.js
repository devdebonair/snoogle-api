const Search = require("../../controllers").Search;
const account = require("../../config").reddit;
const _ = require("lodash");

module.exports = (router) => {
    router.route("/search/photos")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const search = new Search(accountOptions);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.query.term
            };
            search.getPhotos(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/videos")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const search = new Search(accountOptions);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.query.term
            };
            search.getVideos(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/links")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const search = new Search(accountOptions);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.query.term
            };
            search.getLinks(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/subreddits")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const search = new Search(accountOptions);
            const options = {
                query: req.query.term
            };
            search.getSubreddits(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/discussions")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const search = new Search(accountOptions);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.query.term
            };
            search.getDiscussions(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });
};
