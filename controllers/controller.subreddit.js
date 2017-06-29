const RedditController = require("./controller.reddit");
const paginate = require("../helpers/helper.array").paginate;
const Cache = require("../cache/cache.subreddit");
const formatPost = require("../helpers/helper.listing").formatPost;
const fetchMedia = require("../helpers/helper.listing").fetchMedia;

const CACHE_CAPACITY = 500;
const CACHE_PAGE_SIZE = 25;
const CACHE_EXPIRATION = 60 * 12; // 12 minutes in seconds

module.exports = class Subreddit extends RedditController {
    constructor(options) {
        super(options);
    }

    async fetch(options = {}) {
        if(this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide subreddit.");
        }
        try {
            return await this.snoo.getSubreddit(options.subreddit).fetch();
        } catch(error) {
            return error;
        }
    }

    async subscribe(options = {}) {
        if(this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide subreddit.");
        }
        try {
            return await this.snoo.getSubreddit(options.subreddit).subscribe();
        } catch(e) {
            throw e;
        }
    }

    async unsubscribe(options = {}) {
        if(this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide subreddit.");
        }
        try {
            return await this.snoo.getSubreddit(options.subreddit).unsubscribe();
        } catch(e) {
            throw e;
        }
    }

    async submitLink(options = {}) {
        if(this._.isEmpty(options.title) || this._.isEmpty(options.url) || this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide title, url, and subreddit", 500);
        }
        const defaults = {subreddit: "", title: "", url: "", sendReplies: true};
        options = this._.assign(defaults, options);
        try {
            return await this.snoo.getSubreddit(options.subreddit).submitLink(options);
        } catch(e) {
            throw e;
        }
    }

    async submitText(options = {}) {
        if(this._.isEmpty(options.title) || this._.isEmpty(options.text) || this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide title, text, and subreddit", 500);
        }
        const defaults = {subreddit: "", title: "", text: "", sendReplies: true};
        options = this._.assign(defaults, options);
        try {
            return await this.snoo.getSubreddit(options.subreddit).submitSelfpost(options);
        } catch(e) {
            throw e;
        }
    }

    async _getListing(options = {}) {
        const self = this;
        const defaults = { subreddit: null, after: null, sort: "hot", limit: 25 };
        options = this._.assign(defaults, options);
        const sort = options.sort || "hot";
        try {
            let subreddit = this.snoo;
            switch (sort) {
                case "new":
                    subreddit = await subreddit.getNew(options.subreddit, options); break;
                case "hot":
                    subreddit = await subreddit.getHot(options.subreddit, options); break;
                case "rising":
                    subreddit = await subreddit.getRising(options.subreddit, options); break;
                case "top":
                    subreddit = await subreddit.getTop(options.subreddit, options); break;
                case "controversial":
                    subreddit = await subreddit.getControversial(options.subreddit, options); break;
                default:
                    throw this.errors.invalid.sort;
            }

            let formattedListing = this.formatListing(subreddit);

            // slice out extra submissions reddit seems to add (may be temporary)
            formattedListing.data = formattedListing.data.slice(0,options.limit);
            formattedListing.after = formattedListing.data[formattedListing.data.length - 1].name;

            // Fetch media
            let posts = formattedListing.data;
            let promises = posts.map(post => {
                return fetchMedia(post);
            });
            let postsWithMedia = await Promise.all(promises);
            formattedListing.data = postsWithMedia;
            return formattedListing;
        } catch(e) {
            throw e;
        } 
    }

    async getListing(options = {}) {
        const query = { subreddit: options.subreddit, sort: options.sort, after: (options.after || "null") };
        try {
            let listingFromCache = await Cache.getListing(query);
            if(this._.isEmpty(listingFromCache)) {
                this._cachePages({subreddit: options.subreddit, sort: options.sort}).catch(console.log);
                return await this._getListing(options);
            }
            return listingFromCache;
        } catch(error) {
            throw error;
        }
    }

    async _cachePages(options = {}) {
        try {
            const cacheDetails = this._.assign(options, {limit: CACHE_CAPACITY});
            let listing = await this._getListing(cacheDetails);

            const pages = paginate({items: listing.data, pageSize: CACHE_PAGE_SIZE});
            const pagesWithFormat = pages.map((listingData, index, origin) => {
                let formatting = {};
                formatting.data = listingData;
                formatting.isFinished = false;
                formatting.after = formatting.data[formatting.data.length - 1].name;
                return formatting;
            });

            let cacheObject = {};
            cacheObject.subreddit = cacheDetails.subreddit;
            cacheObject.sort = cacheDetails.sort;
            cacheObject.exp = CACHE_EXPIRATION;
            cacheObject.listings = pagesWithFormat;
            return await Cache.storeManyListings(cacheObject);
        } catch(e) {
            throw e;
        }
    }
};