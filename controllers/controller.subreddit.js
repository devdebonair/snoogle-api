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
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    subscribe(subreddit) {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubreddit(subreddit)
            .subscribe()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    unsubscribe(subreddit) {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubreddit(subreddit)
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

};
