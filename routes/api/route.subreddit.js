const Subreddit = require("../../controllers").Subreddit;
const account = require("../../config").reddit;
const Cache = require("../../cache").shared;
const _ = require("lodash");
const paginate = require("../../helpers/helper.listing").paginate;

module.exports = (router) => {

    router.route("/frontpage/:sort")
        .get((req, res) => {
            const subreddit = new Subreddit(account);
            let options = { sort: req.params.sort, after: req.body.after };
            subreddit.getListing(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name")
        .get((req, res) => {
            const subreddit = new Subreddit(account);
            let options = {subreddit: req.params.name};
            subreddit.fetch(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/listing/:sort")
        .get((req, res) => {
            const subreddit = new Subreddit(account);
            const after = req.query.after;
            let options = {subreddit: req.params.name, sort: req.params.sort, after: after};

            return subreddit.getListing(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/subscribe")
        .post((req, res) => {
            const subreddit = new Subreddit(account);
            let options = {subreddit: req.params.name};
            subreddit.subscribe(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/unsubscribe")
        .post((req, res) => {
            const subreddit = new Subreddit(account);
            let options = {subreddit: req.params.name};
            subreddit.unsubscribe(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/submit/text")
        .post((req, res) => {
            const subreddit = new Subreddit(account);
            const options = { title: req.body.title, text: req.body.text, subreddit: req.params.name };
            subreddit.submitText(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/subreddit/:name/submit/link")
        .post((req, res) => {
            const subreddit = new Subreddit(account);
            const options = { title: req.body.title, url: req.body.url, subreddit: req.params.name };
            subreddit.submitLink(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

};
