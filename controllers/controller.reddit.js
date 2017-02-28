const snoowrap = require("snoowrap");
const RedditError = require("../helpers/RedditError.js");
const Fetcher = require("../fetchers");
const lodash = require("lodash");
const helperListing = require("../helpers/helper.listing");
const snoowrapHelper = require("../helpers/helper.snoowrap");

module.exports = class RedditController {
    constructor(options) {
        this.snoo = new snoowrap(options);
        this.fetcher = new Fetcher();
        this._ = lodash;
        this.formatListing = helperListing.format;
        this.parseSnooStatusCode = snoowrapHelper.parseStatusCode;
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
};
