const RedditController = require("./controller.reddit");

module.exports = class ListingController extends RedditController {

    constructor(options) {
        super(options);
    }

    fetch(subreddit, options) {
        const self = this;
        const defaults = {
            ommittedKeys: [],
            after: null,
            sort: "hot"
        };
        options = this._.assign(defaults, options);
        return new Promise((resolve, reject) => {
            let sub = this.snoo;
            let sort = options.sort.toLowerCase();

            if(!this._.isEmpty(subreddit)) {
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
                return self.fetcher.fetchAllMedia(listings.data).then(data => {
                    listings.data = data;
                    return listings;
                });
            }

            sub
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            })
            .then(data => { return this.formatListing(data, options.ommittedKeys); })
            .catch(error => { return reject(self.errors.format); })
            .then(fetchMedia)
            .catch(reject)
            .then(resolve)
            .catch(error => {
                reject(self.errors.unknown);
            });
        });
    }

};
