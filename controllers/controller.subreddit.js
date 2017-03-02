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

};
