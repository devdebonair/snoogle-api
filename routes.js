const _ = require("lodash");
const Fetcher = require("./fetchers");

exports.sendResponse = (req, res, next) => {
    return res.status(200).send("Server response.");
};

exports.getSubreddit = (ommittedKeys, services) => {
    return (req, res, next) => {
        let subreddit = req.params.sub.toLowerCase();
        let sort = req.params.sort.toLowerCase();
        let sub = services.reddit.getSubreddit(subreddit);

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

        function format(data) { return JSON.parse(JSON.stringify(data)); }
        function removeOmittedKeys(data) { return omitKeys(data, ommittedKeys); }
        function removePreviewKey(data) { return omitKeys(data, ["preview"]); }
        function fetchMedia(data) { return Fetcher.fetchAllMedia(data, services); }

        function omitKeys(data, keys) {
            return data.map(listing => {
                return _.omit(listing, keys);
            });
        }

        function addHamletMedia(data) {
            return data.map(listing => {
                listing.hamlet_media = null;
                return listing;
            });
        }

        sub
        .map(format)
        .then(removeOmittedKeys)
        .then(addHamletMedia)
        .then(fetchMedia)
        .then(removePreviewKey)
        .then(res.json)
        .catch(function(error){
            return res.status(404).send(error).end();
        });
    };
};
