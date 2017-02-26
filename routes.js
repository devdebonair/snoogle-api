const _ = require("lodash");
const Reddit = require("./services/service.reddit");
const flatten = require("./helpers/helper.flatten");
const RedditModel = require("./Reddit");

module.exports = class Routes {

    constructor() {
        this.reddit = Reddit;
        this.model = new RedditModel();
        this.ommittedListingKeys = [
            'secure_media',
            'secure_media_embed',
            'secure_media_embed',
            'media',
            'media_embed',
            'selftext_html',
            'preview'
        ];
    }

    sendResponse() {
        return (req, res, next) => {
            return res.status(200).send("Server response.");
        };
    }

    getUser() {
        return (req, res, next) => {
            let id = req.params.id;
            this.model
            .getUser(id)
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
                ommittedKeys: this.ommittedListingKeys,
                sort: sort
            };
            this.model
            .getUserSubmissions(id, sort, options)
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
            this.model
            .getSubmission(req.params.submissionId, options)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status((error.code || 500)).json(responseData);
            });
        };
    }

    getSubreddit() {
        let self = this;
        return (req, res, next) => {
            let subreddit = req.params.sub.toLowerCase();
            let sort = req.params.sort.toLowerCase();
            let options = {
                after: req.query.after,
                ommittedKeys: self.ommittedListingKeys
            };
            self.model.getListing(subreddit, sort, options)
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
            self.model.getListing(null, sort, options).then(res.status(200).json)
            .catch(error => {
                let responseData = _.pick(error, ["name", "message", "code"]);
                res.status(error.code).json(responseData);
            });
        };
    }
};
