const _ = require("lodash");
const Fetcher = require("./fetchers");

module.exports = class Routes {

    constructor(services) {
        this.services = services;
        this.fetcher = new Fetcher(services);
    }

    sendResponse() {
        return (req, res, next) => {
            return res.status(200).send("Server response.");
        };
    }

    getSubreddit(ommittedKeys) {
        let self = this;
        return (req, res, next) => {
            let subreddit = req.params.sub.toLowerCase();
            let sort = req.params.sort.toLowerCase();
            let sub = this.services.reddit.getSubreddit(subreddit);

            switch (sort) {
                case "new":
                sub = sub.getNew(); break;
                case "hot":
                sub = sub.getHot(); break;
                case "rising":
                sub = sub.getRising(); break;
                case "top":
                sub = sub.getTop(); break;
                case "controversial":
                sub = sub.getControversial(); break;
                default:
                return res.status(404).json({error: "Invalid Sort Type"}).end();
            }

            function addHamletMedia(data) {
                return data.map(listing => {
                    listing.hamlet_media = null;
                    return listing;
                });
            }

            function format(data) {
                return data.toJSON();
            }

            function removeOmittedKeys(data) {
                return data.map(listing => {
                    return _.omit(listing, ommittedKeys);
                });
            }

            function fetchMedia(data) { return self.fetcher.fetchAllMedia(data); }

            sub
            .then(format)
            .then(addHamletMedia)
            .then(fetchMedia)
            .then(removeOmittedKeys)
            .then(res.json)
            .catch(function(error){
                console.log(error);
                return res.status(404).send(error).end();
            });
        };
    }
};
