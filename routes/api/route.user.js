const User = require("../../controllers").User;
const account = require("../../config").reddit;
const _ = require("lodash");

module.exports = (router) => {
    router.route("/users/:name")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const user = new User(accountOptions);
            user.fetch({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/trophies")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const user = new User(accountOptions);
            user.getTrophies({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/comments/:sort")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const user = new User(accountOptions);
            user.getComments({name: req.params.name, sort: req.params.sort})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/submissions/:sort")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const user = new User(accountOptions);
            user.getSubmissions({name: req.params.name, sort: req.params.sort})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/friend")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const user = new User(accountOptions);
            user.addFriend({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/unfriend")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const user = new User(accountOptions);
            user.removeFriend({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });
};
