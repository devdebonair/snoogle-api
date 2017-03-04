const flatten = require("../helpers/helper.flatten");
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
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getUser(options = {}) {
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
                return self.fetcher.fetchAllMedia(listings.data).then(function(data){
                    listings.data = data;
                    return listings;
                });
            }
            if(this._.isEmpty(options.name) || this._.isEmpty(sort)) {
                return reject("InvalidArguments", "Must provide name and valid sort.");
            }
            let supportedSorts = ["new", "hot", "top", "controversial"];
            if(supportedSorts.indexOf(sort) === -1) {
                return reject(this.errors.invalid.sort);
            }
            this.snoo
            .getUser(options.name)
            .getSubmissions(options)
            .then(data => this.formatListing(data, options.ommittedKeys))
            .catch(error => reject(this.errors.format))
            .then(fetchMedia)
            .catch(reject)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getComments(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(sort)) {
                return reject("InvalidArguments", "Must provide name and valid sort.");
            }
            let supportedSorts = ["new", "hot", "top", "controversial"];
            if(supportedSorts.indexOf(sort) === -1) {
                return reject(this.errors.invalid.sort);
            }
            this.snoo
            .getUser(options.name)
            .getComments(options)
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

    getSubscriptions() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubscriptions()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
