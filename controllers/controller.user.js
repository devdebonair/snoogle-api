const RedditController = require("./controller.reddit");

module.exports = class User extends RedditController {
    constructor(options) {
        super(options);
    }

    addFriend(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name of user.", 500));
            }
            this.snoo
            .getUser(options.name)
            .friend()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    removeFriend(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name of user.", 500));
            }
            this.snoo
            .getUser(options.name)
            .unfriend()
            .then(_ => resolve({success: true}))
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    fetch(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name of user.", 500));
            }
            this.snoo
            .getUser(options.name)
            .fetch()
            .then(user => {
                let data = user.toJSON();
                resolve(data);
            })
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getTrophies(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name of user.", 500));
            }
            this.snoo
            .getUser(options.name)
            .getTrophies()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getSubmissions(options = {}) {
        return new Promise((resolve, reject) => {
            let self = this;
            function fetchMedia(listings) {
                return self.fetcher.fetchAllMedia(listings.data).then((data) => {
                    listings.data = data;
                    return listings;
                });
            }
            if(this._.isEmpty(options.name)) {
                return reject("InvalidArguments", "Must provide name.");
            }
            let supportedSorts = ["new", "hot", "top", "controversial"];
            let defaults = { name: "", sort: "hot"};
            options = this._.assign(defaults, options);
            this.snoo
            .getUser(options.name)
            .getSubmissions(options)
            .then(data => this.formatListing(data, options.ommittedKeys))
            .then(fetchMedia)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getComments(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject("InvalidArguments", "Must provide name.");
            }
            let supportedSorts = ["new", "hot", "top", "controversial"];
            let defaults = { name: "", sort: "hot"};
            options = this._.assign(defaults, options);
            this.snoo
            .getUser(options.name)
            .getComments(options)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
