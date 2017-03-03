const RedditError = require("../helpers/RedditError.js");
const RedditController = require("./controller.reddit");

module.exports = class Subreddit extends RedditController {

    constructor(options) {
        super(options);
    }

    fetch(subreddit, options) {
        let defaults = {
            ommittedKeys: []
        };
        options = this._.assign(defaults, options);
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubreddit(subreddit)
            .fetch()
            .then(data => data.toJSON())
            .then(data => this._.omit(data, options.ommittedKeys))
            .then(resolve)
            .catch(error => {
                let code = this.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
        });
    }

    subscribe(subreddit) {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubreddit(subreddit)
            .subscribe()
            .then(resolve)
            .catch(error => {
                let code = this.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
        });
    }

    unsubscribe(subreddit) {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubreddit(subreddit)
            .unsubscribe()
            .then(resolve)
            .catch(error => {
                let code = this.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
        });
    }

    submitLink(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.title) || this._.isEmpty(options.url) || this._.isEmpty(options.subreddit)) {
                return reject(new RedditError("InvalidArguments", "Must provide title, url, and subreddit", 500));
            }
            const defaults = {subreddit: "", title: "", url: "", sendReplies: true};
            options = this._.assign(defaults, options);
            this.snoo
            .getSubreddit(options.subreddit)
            .submitLink(options)
            .then(resolve)
            .catch(error => {
                let code = this.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
        });
    }

    submitText(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.title) || this._.isEmpty(options.text) || this._.isEmpty(options.subreddit)) {
                return reject(new RedditError("InvalidArguments", "Must provide title, text, and subreddit", 500));
            }
            const defaults = {subreddit: "", title: "", text: "", sendReplies: true};
            options = this._.assign(defaults, options);
            this.snoo
            .getSubreddit(options.subreddit)
            .submitSelfpost(options)
            .then(resolve)
            .catch(error => {
                let code = this.parseSnooStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            });
        });
    }

};
