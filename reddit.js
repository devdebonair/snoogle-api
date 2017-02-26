const _ = require("lodash");
const Fetcher = require("./fetchers");
const flatten = require("./helpers/helper.flatten");
const snoowrapHelper = require("./helpers/helper.snoowrap");
const RedditError = require("./helpers/RedditError");
const RedditService = require("./services/service.reddit");

module.exports = class Reddit {
    constructor() {
        this.reddit = RedditService;
        this.fetcher = new Fetcher();

        this.errors = {
            unknown: new RedditError("UnknownError", "An unkown error has occurred.", 404),
            format: new RedditError("FormatError", "An error occurred while formatting original reddit response."),
            reddit: new RedditError("RedditError", "An error occurred with Reddit servers.", 500),
            media: new RedditError("MediaError", "Error fetching media content."),
            invalid: {
                sort: new RedditError("InvalidSort", "Sort is not supported.")
            }
        };
    }

    getSubmission(submissionId, options) {
        return new Promise((resolve, reject) => {
            this.reddit
            .getSubmission(submissionId).comments
            .catch(error => {
                let code = snoowrapHelper.parseStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            })
            .then(comments => comments.toJSON())
            .then(comments => {
                return { replies: comments };
            })
            .then(flatten)
            .then(comments => {
                return comments.map(comment => {
                    return _.omit(comment, options.ommittedKeys);
                });
            })
            .then(resolve)
            .catch(reject);
        });
    }

    getListing(subreddit, sort, options) {
        const self = this;
        return new Promise((resolve, reject) => {

            let sub = RedditService;
            sort = sort.toLowerCase();

            if(!_.isEmpty(subreddit)) {
                subreddit = subreddit.toLowerCase();
                sub = sub.getSubreddit(subreddit);
            }

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
                return reject(self.errors.invalid.sort);
            }

            function fetchMedia(listings) {
                return self.fetcher.fetchAllMedia(listings.data).then(function(data){
                    listings.data = data;
                    return listings;
                });
            }

            sub
            .catch(error => {
                let code = snoowrapHelper.parseStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            })
            .then(data => { return self.formatListing(data, options.ommittedKeys); })
            .catch(error => { reject(self.errors.format); })
            .then(fetchMedia)
            .catch(reject)
            .then(resolve)
            .catch(error => {
                reject(self.errors.unknown);
            });
        });
    }

    formatListing(listing, ommittedKeys) {
        return new Promise((resolve, reject) => {
            // Add application specific details and nest listings
            let retval = {};
            retval.isFinished = listing.isFinished;
            retval.after = null;
            if(listing.length > 0) {
                retval.after = listing[listing.length - 1].name;
            }

            // convert snoowrap class to JSON
            retval.data = listing.toJSON();

            // add hamlet media
            retval.data.map(post => {
                post.hamlet_media = {};
                post.hamlet_album = [];
                post.hamlet_errors = [];
                return post;
            });

            // Remove specified keys
            retval.data = retval.data.map(post => {
                return _.omit(post, ommittedKeys);
            });

            // Remove multiple newline characters
            retval.data = retval.data.map(post => {
                post.selftext = post.selftext.replace(/(\n)+/g, "\n");
                post.selftext = post.selftext.replace(/([ ]+)(?=\n)(\1*)/g, "");
                return post;
            });

            resolve(retval);
        });
    }
};
