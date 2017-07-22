const Search = require("../../controllers").Search;
const account = require("../../config").reddit;

module.exports = (router) => {
    router.route("/search/:term/photos")
        .get((req, res) => {
            const search = new Search(account);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.params.term
            };
            search.getPhotos(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/:term/videos")
        .get((req, res) => {
            const search = new Search(account);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.params.term
            };
            search.getVideos(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/:term/links")
        .get((req, res) => {
            const search = new Search(account);
            const options = {
                time: req.query.time,
                subreddit: req.query.subreddit,
                restrictSr: req.query.restrict,
                sort: req.query.sort,
                term: req.params.term
            };
            search.getLinks(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/:term/subreddits")
        .get((req, res) => {
            const search = new Search(account);
            const options = {
                query: req.params.term
            };
            search.getSubreddits(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/search/:term/discussions")
        .get((req, res) => {
            const search = new Search(account);
            const options = {
                query: req.params.term
            };
            search.getDiscussions(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });
};
