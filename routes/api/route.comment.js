const Comment = require("../../controllers").Comment;
const account = require("../../config").accounts.test;

module.exports = (router) => {
    router.route("/comments/:id")
        .get((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.fetch(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        })
        .put((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id, text: req.body.text};
            comment.edit(options)
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
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.delete(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/comments/:id/upvote")
        .post((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.upvote(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/comments/:id/downvote")
        .post((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.downvote(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/comments/:id/save")
        .post((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.save(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/comments/:id/unsave")
        .post((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.unsave(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/comments/:id/unvote")
        .post((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id};
            comment.unvote(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/comments/:id/reply")
        .post((req, res) => {
            const comment = new Comment(account);
            const options = {id: req.params.id, text: req.body.text};
            comment.reply(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });
};
