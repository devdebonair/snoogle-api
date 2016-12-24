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
            let after = req.query.after;
            let options = {after: after};
            switch (sort) {
                case "new":
                sub = sub.getNew(options); break;
                case "hot":
                sub = sub.getHot(options); break;
                case "rising":
                sub = sub.getRising(options); break;
                case "top":
                sub = sub.getTop(options); break;
                case "controversial":
                sub = sub.getControversial(options); break;
                default:
                return res.status(404).json({error: "Invalid Sort Type"}).end();
            }

            function format(listings) {
                let retval = {};
                retval.isFinished = listings.isFinished;
                retval.after = null;
                if(listings.length > 0) {
                    retval.after = listings[listings.length - 1].name;
                }
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
