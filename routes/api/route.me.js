const Me = require("../../controllers").Me;
const account = require("../../config").reddit;
const _ = require("lodash");

module.exports = (router) => {
    router.route("/me")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const me = new Me(options);
            me.fetch()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/multireddits")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const me = new Me(account);
            me.getMultireddits()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/subscriptions")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getSubscriptions()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/trophies")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getTrophies()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/friends")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getFriends()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/blocked")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getBlocked()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getInbox()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox/unread")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getUnreadInbox()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox/private")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getPrivateMessages()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox/replies/comments")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getCommentReplies()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox/replies/submissions")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getSubmissionReplies()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox/mentions")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getMentions()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/me/inbox/sent")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let options = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
        	const me = new Me(options);
            me.getSentMessages()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });
};
