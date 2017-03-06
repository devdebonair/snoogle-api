const Me = require("../../controllers").Me;
const account = require("../../config").accounts.test;

module.exports = (router) => {
    router.route("/me")
        .get((req, res) => {
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
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
            const me = new Me(account);
            me.getSentMessages()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });
};
