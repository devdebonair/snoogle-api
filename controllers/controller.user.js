const RedditController = require("./controller.reddit");

module.exports = class User extends RedditController {
    constructor(options) {
        super(options);
    }

    async addFriend(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name of user.", 500);
        }
        try {
            return await this.snoo.getUser(options.name).friend();
        } catch(e) {
            throw e;
        }
    }

    async removeFriend(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name of user.", 500);
        }
        try {
            await this.snoo.getUser(options.name).unfriend();
            return {success: true};
        } catch(e) {
            throw e;
        }
    }

    async fetch(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name of user.", 500);
        }
        try {
            let user = await this.snoo.getUser(options.name).fetch();
            return user.toJSON();
        } catch(e) {
            throw e;
        }
    }

    async getTrophies(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name of user.", 500);
        }
        try {
            return await this.snoo.getUser(options.name).getTrophies();
        } catch(e) {
            throw e;
        }
    }

    async getSubmissions(options = {}) {
        let self = this;
        function fetchMedia(listings) {
            return self.fetcher.fetchAllMedia(listings.data).then((data) => {
                listings.data = data;
                return listings;
            });
        }

        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name of user.", 500);
        }

        let supportedSorts = ["new", "hot", "top", "controversial"];
        let defaults = { name: "", sort: "hot"};
        options = this._.assign(defaults, options);

        try {
            let submissions = await this.snoo.getUser(options.name).getSubmissions(options);
            let formattedListing = this.formatListing(submissions, options.ommittedKeys);
            let listingWithMedia = fetchMedia(formattedListing);
            return listingWithMedia;
        } catch(e) {
            throw e;
        }
    }

    async getComments(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name of user.", 500);
        }
        let supportedSorts = ["new", "hot", "top", "controversial"];
        let defaults = { name: "", sort: "hot"};
        options = this._.assign(defaults, options);
        try {
            return await this.snoo.getUser(options.name).getComments(options);
        } catch(e) {
            throw e;
        }
    }
};
