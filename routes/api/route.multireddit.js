const Multireddit = require("../../controllers").Multireddit;
const account = require("../../config").reddit;
const _ = require("lodash");

module.exports = (router) => {
    router.route("/multireddits")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const multi = new Multireddit(accountOptions);
            const options = {name: req.body.name, description: req.body.description, subreddits: req.body.subreddits};
            multi.create(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/multireddits/:name")
        .delete((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const multi = new Multireddit(accountOptions);
            const options = {name: req.params.name};
            multi.delete(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        })
        .put((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const multi = new Multireddit(accountOptions);
            const options = {
                name: req.params.name,
                edits: {
                    title: req.body.title,
                    name: req.body.name,
                    description: req.body.description,
                    visibility: req.body.visibility,
                    icon_name: req.body.icon,
                    key_color: req.body.color,
                    weighting_scheme: req.body.weight
                }
            };
            multi.edit(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/multireddits/:name/subreddits")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const multi = new Multireddit(accountOptions);
            const options = {name: req.params.name, subreddit: req.body.subreddit};
            multi.addSubreddit(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        })
        .delete((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const multi = new Multireddit(accountOptions);
            const options = {name: req.params.name, subreddit: req.body.subreddit};
            multi.removeSubreddit(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/multireddits/copy")
        .post((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const multi = new Multireddit(accountOptions);
            const options = {user: req.body.user, user_multiname: req.body.user_multiname, new_multiname: req.body.new_multiname};
            multi.copy(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });
};
