const _ = require("lodash");
const Reddit = require("./controllers");
const config = require("./config");

module.exports = class Routes {

    constructor() {
        this.ommittedListingKeys = [
            'secure_media',
            'secure_media_embed',
            'secure_media_embed',
            'media',
            'media_embed',
            'selftext_html',
            'preview'
        ];

        this.snooOptions = config.accounts.devdebonair;
    }

    sendResponse() {
        return (req, res, next) => {
            return res.status(200).send("Server response.");
        };
    }

    getSubreddit() {
        return (req, res, next) => {
            let subreddit = req.params.name;
            let options = {
                ommittedKeys: [
                    "submit_text_html",
                    "description_html",
                    "public_description_html"
                ]
            };
            new Reddit.Subreddit(this.snooOptions)
            .fetch("rocketleague", options)
            .then(data => res.status(200).json(data))
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getUser() {
        return (req, res, next) => {
            let id = req.params.id;
            let user = new Reddit.User(this.snooOptions);
            user.getUser(id)
            .then(data => res.status(200).json(data))
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getUserComments() {
        return (req, res, next) => {
            let id = req.params.id;
            let sort = req.params.sort.toLowerCase();
            let options = {
                after: req.query.after,
                ommittedKeys: ["body_html"]
            };
            let user = new Reddit.User(this.snooOptions);
            user.getUserComments(id, sort, options)
            .then(data => res.status(200).json(data))
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getUserSubmissions() {
        return (req, res, next) => {
            let id = req.params.id;
            let sort = req.params.sort.toLowerCase();
            let options = {
                after: req.query.after,
                ommittedKeys: this.ommittedListingKeys
            };
            let user = new Reddit.User(this.snooOptions);
            user.getUserSubmissions(id, sort, options)
            .then(data => res.status(200).json(data))
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getSubmission() {
        let options = {
            ommittedKeys: ["body_html"]
        };
        return (req, res, next) => {
            let submission = new Reddit.Submission(this.snooOptions);
            submission.getComments(req.params.id, options)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    upvoteSubmission() {
        return (req, res, next) => {
            let submissionId = req.params.id;
            new Reddit.Submission(this.snooOptions)
            .upvote(submissionId)
            .then(data => {
                return res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    downvoteSubmission() {
        return (req, res, next) => {
            let submissionId = req.params.id;
            new Reddit.Submission(this.snooOptions)
            .downvote(submissionId)
            .then(data => {
                return res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    saveSubmission() {
        return (req, res, next) => {
            let submissionId = req.params.id;
            new Reddit.Submission(this.snooOptions)
            .save(submissionId)
            .then(data => {
                return res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    unsaveSubmission() {
        return (req, res, next) => {
            let submissionId = req.params.id;
            new Reddit.Submission(this.snooOptions)
            .unsave(submissionId)
            .then(data => {
                return res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    unvoteSubmission() {
        return (req, res, next) => {
            let submissionId = req.params.id;
            new Reddit.Submission(this.snooOptions)
            .unvote(submissionId)
            .then(data => {
                return res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getListing() {
        let self = this;
        return (req, res, next) => {
            let subreddit = req.params.name.toLowerCase();
            let sort = req.params.sort.toLowerCase();
            let options = {
                after: req.query.after,
                ommittedKeys: self.ommittedListingKeys,
                sort: sort
            };
            let listing = new Reddit.Listing(this.snooOptions);
            listing.fetch(subreddit, options)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getFrontPage() {
        let self = this;
        return (req, res, next) => {
            let sort = req.params.sort.toLowerCase();
            let options = {
                after: req.query.after,
                ommittedKeys: this.ommittedListingKeys
            };
            let listing = new Reddit.Listing(this.snooOptions);
            listing.fetch(null, sort, options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                return res.status(error.code).json(responseData);
            });
        };
    }

    getUserTrophies() {
        let self = this;
        return (req, res, next) => {
            let id = req.params.id;
            let user = new Reddit.User(this.snooOptions);
            user.getUserTrophies(id)
            .then(data => {
                res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status(error.code).json(responseData);
            });
        };
    }

    addFriend() {
        let self = this;
        return (req, res, next) => {
            let id = req.params.id;
            let user = new Reddit.User(this.snooOptions);
            user.addFriend(id)
            .then(data => {
                res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status(error.code).json(responseData);
            });
        };
    }

    removeFriend() {
        let self = this;
        return (req, res, next) => {
            let id = req.params.id;
            let user = new Reddit.User(this.snooOptions);
            user.removeFriend(id)
            .then(data => {
                res.status(200).json({data: data});
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status(error.code).json(responseData);
            });
        };
    }
};
