const RedditController = require("./controller.reddit");

module.exports = class ListingController extends RedditController {
    constructor(options) {
        super(options);
    }

    fetch(options = {}) {
        const self = this;
        const defaults = {
            omit: [],
            subreddit: null,
            after: null,
            sort: "hot"
        };
        options = this._.assign(defaults, options);
        return new Promise((resolve, reject) => {
            let subreddit = this.snoo;
            let sort = options.sort.toLowerCase();

            switch (sort) {
                case "new":
                subreddit = subreddit.getNew(options.subreddit, options); break;
                case "hot":
                subreddit = subreddit.getHot(options.subreddit, options); break;
                case "rising":
                subreddit = subreddit.getRising(options.subreddit, options); break;
                case "top":
                subreddit = subreddit.getTop(options.subreddit, options); break;
                case "controversial":
                subreddit = subreddit.getControversial(options.subreddit, options); break;
                default:
                return reject(this.errors.invalid.sort);
            }

            function fetchMedia(listings) {
                return self.fetcher.fetchAllMedia(listings.data).then(data => {
                    listings.data = data;
                    return listings;
                });
            }

            subreddit
            .then(data => { return this.formatListing(data, options.omit); })
            .then(fetchMedia)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
