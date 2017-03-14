const RedditController = require("./controller.reddit");
const paginate = require("../helpers/helper.array").paginate;
const Cache = require("../cache/cache.subreddit");

const CACHE_CAPACITY = 500;
const CACHE_PAGE_SIZE = 25;
const CACHE_EXPIRATION = 60 * 12; // 12 minutes in seconds

module.exports = class Subreddit extends RedditController {
    constructor(options) {
        super(options);
    }

    fetch(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide subreddit."));
            }
            
            this.snoo
                .getSubreddit(options.subreddit)
                .fetch()
                .then(resolve)
                .catch(error => this.parseSnooError(error, reject));
        });
    }

    subscribe(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide subreddit."));
            }
            
            this.snoo
                .getSubreddit(options.subreddit)
                .subscribe()
                .then(resolve)
                .catch(error => this.parseSnooError(error, reject));
        });
    }

    unsubscribe(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide subreddit."));
            }
            
            this.snoo
                .getSubreddit(options.subreddit)
                .unsubscribe()
                .then(resolve)
                .catch(error => this.parseSnooError(error, reject));
        });
    }

    submitLink(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.title) || this._.isEmpty(options.url) || this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide title, url, and subreddit", 500));
            }
            const defaults = {subreddit: "", title: "", url: "", sendReplies: true};
            options = this._.assign(defaults, options);
            
            this.snoo
                .getSubreddit(options.subreddit)
                .submitLink(options)
                .then(resolve)
                .catch(error => this.parseSnooError(error, reject));
        });
    }

    submitText(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.title) || this._.isEmpty(options.text) || this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide title, text, and subreddit", 500));
            }
            const defaults = {subreddit: "", title: "", text: "", sendReplies: true};
            options = this._.assign(defaults, options);
            
            this.snoo
                .getSubreddit(options.subreddit)
                .submitSelfpost(options)
                .then(resolve)
                .catch(error => this.parseSnooError(error, reject));
        });
    }

    _getListing(options = {}) {
        const self = this;
        const defaults = { subreddit: null, after: null, sort: "hot", limit: 25 };
        options = this._.assign(defaults, options);
        options.sort = options.sort || defaults.sort;
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

            // slice out extra submissions reddit seems to add (may be temporary)
            function cap(listing) {
                listing.data = listing.data.slice(0,options.limit);
                listing.after = listing.data[listing.data.length - 1].name;
                return listing;
            }

            function fetchMedia(listings) {
                return self.fetcher
                .fetchAllMedia(listings.data)
                .then(data => {
                    listings.data = data;
                    return listings;
                });
            }

            subreddit
                .then(data => { return this.formatListing(data); })
                .then(cap)
                .then(fetchMedia)
                .then(resolve)
                .catch(error => this.parseSnooError(error, reject));
        });
    }

    getListing(options = {}) {
        return new Promise((resolve, reject) => {
            const query = { subreddit: options.subreddit, sort: options.sort, after: (options.after || "null") };

            function cacheAndFetch(listing) {
                if(this._.isEmpty(listing)) {
                    this._cachePages({subreddit: options.subreddit, sort: options.sort}).then(console.log).catch(console.log);
                    return this._getListing(options);
                }
                return listing;
            }

            Cache
                .getListing(query)
                .then(cacheAndFetch.bind(this))
                .then(resolve)
                .catch(reject);
        });
    }

    _cachePages(options = {}) {
        return new Promise((resolve, reject) => {

            const cacheDetails = this._.assign(options, {limit: CACHE_CAPACITY});

            function split(listing) {
                const pages = paginate({items: listing.data, pageSize: CACHE_PAGE_SIZE});
                const pagesWithFormat = pages.map((listingData, index, origin) => {
                    let formatting = {};
                    formatting.data = listingData;
                    formatting.isFinished = false;
                    formatting.after = formatting.data[formatting.data.length - 1].name;
                    return formatting;
                });
                return pagesWithFormat;
            }

            function prepare(listings) {
                let cacheObjects = {};
                cacheObjects.subreddit = cacheDetails.subreddit;
                cacheObjects.sort = cacheDetails.sort;
                cacheObjects.exp = CACHE_EXPIRATION;
                cacheObjects.listings = listings;
                return Cache.storeManyListings(cacheObjects);
            }

            this
                ._getListing(cacheDetails)
                .then(split)
                .then(prepare)
                .then(resolve)
                .catch(reject);
        });
    }
};