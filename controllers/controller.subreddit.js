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

        // return new Promise((resolve, reject) => {
        //     let subreddit = this.snoo;

        //     switch (sort) {
        //         case "new":
        //         subreddit = subreddit.getNew(options.subreddit, options); break;
        //         case "hot":
        //         subreddit = subreddit.getHot(options.subreddit, options); break;
        //         case "rising":
        //         subreddit = subreddit.getRising(options.subreddit, options); break;
        //         case "top":
        //         subreddit = subreddit.getTop(options.subreddit, options); break;
        //         case "controversial":
        //         subreddit = subreddit.getControversial(options.subreddit, options); break;
        //         default:
        //         return reject(this.errors.invalid.sort);
        //     }

        //     // slice out extra submissions reddit seems to add (may be temporary)
        //     function cap(listing) {
        //         listing.data = listing.data.slice(0,options.limit);
        //         listing.after = listing.data[listing.data.length - 1].name;
        //         return listing;
        //     }

        //     function getMedia(listing) {
        //         return new Promise((resolve, reject) => {
        //             let posts = listing.data;
        //             let promises = posts.map(post => {
        //                 return fetchMedia(post);
        //             });
        //             Promise
        //             .all(promises)
        //             .then(postsWithMedia => {
        //                 listing.data = postsWithMedia;
        //                 return resolve(listing);
        //             })
        //             .catch(error => {
        //                 console.log("had trouble getting media for posts.");
        //                 return resolve(listing);
        //             });
        //         });
        //     }

        //     function format(listing) {
        //         for(let post of listing.data) {
        //             post = formatPost(post);
        //         }
        //         return listing;
        //     }

        //     subreddit
        //         .then(data => { return this.formatListing(data); })
        //         .then(cap)
        //         .then(format)
        //         .then(getMedia)
        //         .then(resolve)
        //         .catch(error => this.parseSnooError(error, reject));
        // });
    }

    async getListing(options = {}) {
        // return new Promise((resolve, reject) => {
        //     const query = { subreddit: options.subreddit, sort: options.sort, after: (options.after || "null") };

        //     function cacheAndFetch(listing) {
        //         if(this._.isEmpty(listing)) {
        //             this._cachePages({subreddit: options.subreddit, sort: options.sort}).then().catch();
        //             return this._getListing(options);
        //         }
        //         return listing;
        //     }

        //     Cache
        //         .getListing(query)
        //         .then(cacheAndFetch.bind(this))
        //         .then(resolve)
        //         .catch(reject);
        // });
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
        // return new Promise((resolve, reject) => {

        //     const cacheDetails = this._.assign(options, {limit: CACHE_CAPACITY});

        //     function split(listing) {
        //         const pages = paginate({items: listing.data, pageSize: CACHE_PAGE_SIZE});
                // const pagesWithFormat = pages.map((listingData, index, origin) => {
                //     let formatting = {};
                //     formatting.data = listingData;
                //     formatting.isFinished = false;
                //     formatting.after = formatting.data[formatting.data.length - 1].name;
                //     return formatting;
                // });
        //         return pagesWithFormat;
        //     }

        //     function prepare(listings) {
        //         let cacheObjects = {};
        //         cacheObjects.subreddit = cacheDetails.subreddit;
        //         cacheObjects.sort = cacheDetails.sort;
        //         cacheObjects.exp = CACHE_EXPIRATION;
        //         cacheObjects.listings = listings;
        //         return Cache.storeManyListings(cacheObjects);
        //     }

        //     this
        //         ._getListing(cacheDetails)
        //         .then(split)
        //         .then(prepare)
        //         .then(resolve)
        //         .catch(reject);
        // });
        // function split(listing) {
        //     const pages = paginate({items: listing.data, pageSize: CACHE_PAGE_SIZE});
        //     const pagesWithFormat = pages.map((listingData, index, origin) => {
        //         let formatting = {};
        //         formatting.data = listingData;
        //         formatting.isFinished = false;
        //         formatting.after = formatting.data[formatting.data.length - 1].name;
        //         return formatting;
        //     });
        //     return pagesWithFormat;
        // }

        // function prepare(listings) {
        //     let cacheObjects = {};
        //     cacheObjects.subreddit = cacheDetails.subreddit;
        //     cacheObjects.sort = cacheDetails.sort;
        //     cacheObjects.exp = CACHE_EXPIRATION;
        //     cacheObjects.listings = listings;
        //     return Cache.storeManyListings(cacheObjects);
        // }

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