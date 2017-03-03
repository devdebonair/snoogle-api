const flatten = require("../helpers/helper.flatten");
const RedditController = require("./controller.reddit");

module.exports = class User extends RedditController {
    constructor(options) {
        super(options);
    }

    addFriend(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.snoo
            .getUser(id)
            .friend()
            .then(data => resolve(data))
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    removeFriend(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.snoo
            .getUser(id)
            .unfriend()
            .then(data => resolve(data))
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getUser(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.snoo
            .getUser(id)
            .fetch()
            .then(user => {
                let data = user.toJSON();
                resolve(data);
            })
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getUserTrophies(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.snoo
            .getUser(id)
            .getTrophies()
            .then(trophies => {
                resolve(trophies);
            })
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getUserSubmissions(id, sort, options) {
        let self = this;
        return new Promise((resolve, reject) => {
            function fetchMedia(listings) {
                return self.fetcher.fetchAllMedia(listings.data).then(function(data){
                    listings.data = data;
                    return listings;
                });
            }
            let supportedSorts = ["new", "hot", "top", "controversial"];
            if(self._.isEmpty(sort) || supportedSorts.indexOf(sort) === -1) {
                return reject(self.errors.invalid.sort);
            }
            options.sort = sort;
            self.snoo
            .getUser(id)
            .getSubmissions(options)
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                reject(new this.RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            })
            .then(data => { return self.formatListing(data, options.ommittedKeys); })
            .catch(error => { reject(self.errors.format); })
            .then(fetchMedia)
            .catch(reject)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getUserComments(id, sort, options) {
        let self = this;
        return new Promise((resolve, reject) => {
            let supportedSorts = ["new", "hot", "top", "controversial"];
            if(self._.isEmpty(sort) || supportedSorts.indexOf(sort) === -1) {
                return reject(self.errors.invalid.sort);
            }
            options.sort = sort;
            self.snoo
            .getUser(id)
            .getComments(options)
            .then(comments => {
                return comments.toJSON();
            })
            .then(comments => {
                return comments.map(comment => {
                    return self._.omit(comment, options.ommittedKeys);
                });
            })
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getMultireddits() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getMyMultireddits()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
