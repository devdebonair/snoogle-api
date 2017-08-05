const RedditController = require("./controller.reddit");
const fetchMedia = require("../helpers/helper.listing").fetchMedia;
const formatPost = require("../helpers/helper.listing").formatPost;
const remark = require("remark");
const remarkStrip = require("strip-markdown");

module.exports = class Search extends RedditController {
    constructor(options) {
        super(options);
    }

    async getPhotos(options = {}) {
        try {
            let supportedSites = ["imgur", "gfycat"];
            let supportedMediaExtensions = ["jpg", "png", "webm", "gif", "mp4", "jpeg"];
            let siteSearch = supportedSites.reduce((initial, current, index) => {
                return initial += (index == supportedSites.length - 1) ? ` site:${current}` : ` site:${current} OR`;
            }, "").trim();

            let extensionSearch = supportedMediaExtensions.reduce((initial, current, index) => {
                return initial += (index == supportedMediaExtensions.length - 1) ? ` .${current}` : ` .${current} OR`;
            }, "").trim();

            const defaults = {time: "week", query: null, subreddit: null, restrictSr: false, sort: "relevance", syntax: "lucene"};
            let params = this._.assign(defaults, this._.pickBy(options, this._.identity));
            const searchTerm = `${options.term} (${siteSearch}) OR (url:(${extensionSearch}))`;
            params.query = searchTerm;
            const photos = await this.snoo.search(params);
            let promises = photos.map(post => {
                return fetchMedia(post);
            });
            let photosWithMedia = await Promise.all(promises);
            return photosWithMedia;
        } catch(e) {
        	console.log(e);
            throw e;
        }
    }

    async getDiscussions(options = {}) {
        try {
            const defaults = {time: "week", query: null, subreddit: null, restrictSr: false, sort: "relevance", syntax: "lucene"};
            let params = this._.assign(defaults, this._.pickBy(options, this._.identity));
            params.query = `self:yes ${options.term}`;
            let discussions = await this.snoo.search(params);
            discussions = discussions.map(discussion => { return formatPost(discussion) });
            return discussions;
        } catch(e) {
        	console.log(e);
            throw e;
        }
    }

    async getLinks(options = {}) {
        try {
            let supportedSites = ["imgur", "gfycat", "youtube", "vimeo", "vid.me", "youtu", "deviantart", "instagram", "reddit"];
            let supportedMediaExtensions = ["jpg", "png", "webm", "gif", "mp4", "jpeg"];

            let siteSearch = supportedSites.reduce((initial, current, index) => {
                return initial += (index == supportedSites.length - 1) ? ` -site:${current}` : ` -site:${current} AND`;
            }, "").trim();

            let extensionSearch = supportedMediaExtensions.reduce((initial, current, index) => {
                return initial += (index == supportedMediaExtensions.length - 1) ? ` .${current}` : ` .${current} OR`;
            }, "").trim();

            const defaults = {time: "week", query: null, subreddit: null, restrictSr: false, sort: "relevance", syntax: "lucene"};
            let params = this._.assign(defaults, this._.pickBy(options, this._.identity));
            const searchTerm = `${options.term} self:no (${siteSearch}) AND (-url:(${extensionSearch}))`;
            params.query = searchTerm;
            const photos = await this.snoo.search(params);
            return photos;
        } catch(e) {
        	console.log(e);
            throw e;
        }
    }

    async getVideos(options = {}) {
        try {
            let supportedSites = ["youtube", "youtu", "vimeo", "twitch", "vimeo", "worldstar", "vid.me", "pornhub", "spankbang", "spankwire", "youporn", "ruleporn", "periscope", "mixer", "instagram", "hornbunny", "streamable", "funnyordie", "dailymotion", "crunchyroll", "wankflix"];
            let supportedMediaExtensions = ["mp4"];

            let siteSearch = supportedSites.reduce((initial, current, index) => {
                return initial += (index == supportedSites.length - 1) ? ` site:${current}` : ` site:${current} OR`;
            }, "").trim();

            let extensionSearch = supportedMediaExtensions.reduce((initial, current, index) => {
                return initial += (index == supportedMediaExtensions.length - 1) ? ` .${current}` : ` .${current} OR`;
            }, "").trim();

            const defaults = {time: "week", query: null, subreddit: null, restrictSr: false, sort: "relevance", syntax: "lucene"};
            let params = this._.assign(defaults, this._.pickBy(options, this._.identity));
            const searchTerm = `${options.term} (${siteSearch}) OR (url:(${extensionSearch}))`;
            params.query = searchTerm;
            const videos = await this.snoo.search(params);
            return videos;
        } catch(e) {
            throw e;
        }
    }

    async getSubreddits(options = {}) {
        try {
            let defaults = {query: null};
            let params = this._.assign(defaults, this._.pickBy(options, this._.identity));
            let subreddits = await this.snoo.searchSubreddits(params);
            subreddits.map((subreddit) => {
         		remark().use(remarkStrip).process(subreddit.public_description, (err, file) => {
         			subreddit.public_description_stripped = String(file);
         		});
         		return subreddit;
            });
            return subreddits;
        } catch(e) {
        	console.log(e);
            throw e;
        }
    }
};
