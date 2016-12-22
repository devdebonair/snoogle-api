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
                sub = sub.getHot({after: "t3_5icru7"}); break;
                case "rising":
                sub = sub.getRising(); break;
                case "top":
                sub = sub.getTop(); break;
                case "controversial":
                sub = sub.getControversial(); break;
                default:
                return res.status(404).json({error: "Invalid Sort Type"}).end();
            }

            function format(listings) {
                let retval = {};
                retval.isFinished = listings.isFinished;
                retval.data = listings.toJSON();
                return retval;
            }

            function addHamletMedia(listings) {
                listings.data.map(listing => {
                    listing.hamlet_media = {};
                    listing.hamlet_errors = [];
                    return listing;
                });
                return listings;
            }

            function removeOmittedKeys(listings) {
                listings.data = listings.data.map(listing => {
                    return _.omit(listing, ommittedKeys);
                });
                return listings;
            }

            function fetchMedia(listings) {
                return self.fetcher.fetchAllMedia(listings.data).then(function(data){
                    listings.data = data;
                    return listings;
                });
            }

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
