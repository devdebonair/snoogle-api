const flatten = require("../helpers/helper.flatten");
const RedditController = require("./controller.reddit");
const RedditError = require("../helpers/RedditError");

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
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                let message = this.errors.reddit.message;
                reject(new RedditError(this.errors.reddit.name, message, code));
            });
        });
    }

    removeFriend(id) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.snoo
            .getUser(id)
            .unfriend()
            .then(data => resolve(data))
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                let message = this.errors.reddit.message;
                reject(new RedditError(this.errors.reddit.name, message, code));
            });
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
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
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
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
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
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            })
            .then(data => { return self.formatListing(data, options.ommittedKeys); })
            .catch(error => { reject(self.errors.format); })
            .then(fetchMedia)
            .catch(reject)
            .then(resolve)
            .catch(error => {
                reject(self.errors.unknown);
            });
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
            .catch(error => {
                let code = self.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
        });
    }
};
