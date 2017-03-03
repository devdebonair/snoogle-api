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
        this.RedditError = RedditError;
        this.errors = {
            unknown: new this.RedditError("UnknownError", "An unkown error has occurred.", 404),
            format: new this.RedditError("FormatError", "An error occurred while formatting original reddit response."),
            reddit: new this.RedditError("RedditError", "An error occurred with Reddit servers.", 500),
            media: new this.RedditError("MediaError", "Error fetching media content."),
            invalid: {
                sort: new this.RedditError("InvalidSort", "Sort is not supported.")
            }
        };
        this.parseSnooError = (error, reject) => {
            let type = "RedditError";
            let code = this.parseSnooStatusCode(error.message);
            let message = error.message;
            return reject(new this.RedditError(type, message, code));
        };
    }
};
