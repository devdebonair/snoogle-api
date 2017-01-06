const _ = require("lodash");
const Fetcher = require("./fetchers");

function flatten(treeObj, idAttr, parentAttr, childrenAttr, levelAttr) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent_id';
    if (!childrenAttr) childrenAttr = 'replies';
    if (!levelAttr) levelAttr = 'level';

    function flattenChild(childObj, parentId, level) {
        var array = [];

        var childCopy = _.extend({}, childObj);
        childCopy[levelAttr] = level - 1;
        childCopy[parentAttr] = parentId;
        delete childCopy[childrenAttr];
        array.push(childCopy);

        array = array.concat(processChildren(childObj, level));

        return array;
    }

    function processChildren(obj, level) {
        if (!level) level = 0;
        var array = [];
        obj[childrenAttr].forEach(function(childObj) {
            array = array.concat(flattenChild(childObj, obj[idAttr], level+1));
        });

        return array;
    }

    var result = processChildren(treeObj);
    return result;
}


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

    getSubmission() {
        let self = this;
        return (req, res, next) => {


            let submissionId = req.params.submissionId;
            this.services.reddit
            .getSubmission(submissionId)
            .comments
            .then(comments => comments.toJSON())
            .then(comments => { return {replies: comments}; })
            .then(comments => { return flatten(comments); })
            .then(comments => { return comments.map(comment => { return _.omit(comment, ["body_html"]); }); })
            .then((submission) => {
                return res.status(200).json({data: submission});
            })
            .catch((error) => {
                console.log(error);
                return res.status(404).json(error);
            });
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
                    listing.hamlet_album = [];
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

            function formatSelfText(listings) {
                listings.data = listings.data.map(listing => {
                    listing.selftext = listing.selftext.replace(/(\n)+/g, "\n");
                    listing.selftext = listing.selftext.replace(/([ ]+)(?=\n)(\1*)/g, "");
                    return listing;
                });
                return listings;
            }

            sub
            .then(format)
            .then(addHamletMedia)
            .then(fetchMedia)
            .then(removeOmittedKeys)
            .then(formatSelfText)
            .then(res.json)
            .catch(function(error){
                console.log(error);
                return res.status(404).send(error).end();
            });
        };
    }

    getFrontPage(ommittedKeys) {
        let self = this;
        return (req, res, next) => {
            let sort = req.params.sort.toLowerCase();
            let sub = this.services.reddit;
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
                    listing.hamlet_album = [];
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

            function formatSelfText(listings) {
                listings.data = listings.data.map(listing => {
                    listing.selftext = listing.selftext.replace(/(\n)+/g, "\n");
                    listing.selftext = listing.selftext.replace(/([ ]+)(?=\n)(\1*)/g, "");
                    return listing;
                });
                return listings;
            }

            sub
            .then(format)
            .then(addHamletMedia)
            .then(fetchMedia)
            .then(removeOmittedKeys)
            .then(formatSelfText)
            .then(res.json)
            .catch(function(error){
                console.log(error);
                return res.status(404).send(error).end();
            });
        };
    }
};
