const RedditController = require("./controller.reddit");
const paginate = require("../helpers/helper.array").paginate;
const Cache = require("../cache/cache.subreddit");
const Redis = require("../cache");
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

    async fetchActivity(options = {}) {
    	if(this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide subreddit", 500);
        }
       	options.limit = 100;
        try {
        	let cachedActivity = await Redis.shared().getJSONHash({ map: "activity", key: options.subreddit});
        	if(cachedActivity) {
        		return cachedActivity;
        	} else {
	        	let newPosts = await this.snoo.getNew(options.subreddit, options);
	        	let latestUpload = newPosts[0].created || null;
	        	let status = "active";
	        	let discussionPercentage = newPosts.filter(submission => submission.is_self).length / newPosts.length;
	        	let linkPercentage = 1 - discussionPercentage;
	        	let activity = {
	        		subreddit: options.subreddit,
	        		status: status,
	        		latest_post: latestUpload,
	        		percentage_discussion: discussionPercentage,
	        		percentage_link: linkPercentage
	        	};
	        	Redis.shared().storeJSONHash({ map: "activity", key: options.subreddit, value: activity});
	        	return activity;
        	}
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
	        return await this._getListing(options);
        } catch(error) {
            throw error;
        }
    }
};