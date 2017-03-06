const Submission = require("../../controllers").Submission;
const account = require("../../config").accounts.test;

module.exports = (router) => {
    router.route("/submissions/:id")
        .get((req, res) => {
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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

    router.route("/submissions/:id/comments")
        .get((req, res) => {
            const submission = new Submission(account);
            const options = {id: req.params.id};
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
            const submission = new Submission(account);
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
