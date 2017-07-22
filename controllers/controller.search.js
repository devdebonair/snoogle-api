const RedditController = require("./controller.reddit");

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
            let params = this._.assign(defaults, options);
            const searchTerm = `${options.term} (${siteSearch}) OR (url:(${extensionSearch}))`;
            params.query = searchTerm;
            const photos = await this.snoo.search(params);
            return photos;
        } catch(e) {
            throw e;
        }
    }

    async getDiscussions(options = {}) {
        try {
            const defaults = {time: "week", query: null, subreddit: null, restrictSr: false, sort: "relevance", syntax: "lucene"};
            let params = this._.assign(defaults, options);
            params.query = `self:yes ${options.query}`;
            let discussions = await this.snoo.search(params);
            return discussions;
        } catch(e) {
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
            let params = this._.assign(defaults, options);
            const searchTerm = `${options.term} self:no (${siteSearch}) AND (-url:(${extensionSearch}))`;
            params.query = searchTerm;
            const photos = await this.snoo.search(params);
            return photos;
        } catch(e) {
            throw e;
        }
    }

    async getVideos(options = {}) {
        try {
            let supportedSites = ["youtube", "youtu", "vimeo", "twitch", "vimeo", "worldstar", "vid.me", "pornhub", "spankbang", "spankwire", "youporn", "ruleporn", "periscope", "mixer", "instagram", "hornbunny", "streamable", "funnyordie", "dailymotion", "crunchyroll"];
            let supportedMediaExtensions = ["mp4"];

            let siteSearch = supportedSites.reduce((initial, current, index) => {
                return initial += (index == supportedSites.length - 1) ? ` site:${current}` : ` site:${current} OR`;
            }, "").trim();

            let extensionSearch = supportedMediaExtensions.reduce((initial, current, index) => {
                return initial += (index == supportedMediaExtensions.length - 1) ? ` .${current}` : ` .${current} OR`;
            }, "").trim();

            const defaults = {time: "week", query: null, subreddit: null, restrictSr: false, sort: "relevance", syntax: "lucene"};
            let params = this._.assign(defaults, options);
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
            let params = this._.assign(defaults, options);
            let subreddits = await this.snoo.searchSubreddits(params);
            return subreddits;
        } catch(e) {
            throw e;
        }
    }
};
