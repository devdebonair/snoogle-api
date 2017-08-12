const Submission = require("../../controllers").Submission;
const account = require("../../config").reddit;
const _ = require("lodash");

module.exports = (router) => {
    router.route("/submissions/:id")
        .get((req, res) => {
        	let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.fetch(options)
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
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id, text: req.body.text};
            submission.edit(options)
            .then(data => {
                return res.status(200)
                .json({data: data.json.data.things, errors: data.json.errors});
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
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.delete(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/comments/:sort")
        .get((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id, sort: req.params.sort};
            submission.getComments(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/upvote")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.upvote(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/downvote")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.downvote(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/save")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.save(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/hide")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.hide(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/unsave")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.unsave(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/unvote")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.unvote(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/unhide")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id};
            submission.unhide(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/submissions/:id/reply")
        .post((req, res) => {
            let accessToken = req.get("AccessToken");
        	let refreshToken = req.get("RefreshToken");
        	if(_.isEmpty(refreshToken) || _.isEmpty(accessToken)) { return res.status(403).json({message: "Must send access and refresh token."}); }
        	let accountOptions = _.assign({accessToken: accessToken, refreshToken: refreshToken}, account);
            const submission = new Submission(accountOptions);
            const options = {id: req.params.id, text: req.body.text};
            submission.reply(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });
};
