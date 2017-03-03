const RedditError = require("../helpers/RedditError");
const RedditController = require("./controller.reddit");

module.exports = class MultiReddit extends RedditController {
    constructor(options) {
        super(options);
    }

    _getMyMultireddit(name) {
        return new Promise((resolve, reject) => {
            this.snoo
            .getMyMultireddits()
            .then(multireddits => {
                for(let multireddit of multireddits) {
                    if(multireddit.display_name === name) {
                        return resolve(multireddit);
                    } else {
                        return reject(new RedditError("NotFound", `Could not find ${name} in multireddits.`, 404));
                    }
                }
            })
            .then(data => resolve(data))
            .catch(reject);
        });
    }

    addSubreddit(options) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(options.subreddit)) {
                reject(new RedditError("InvalidArguments", "Must provide name and subreddit."));
            }
            this._getMyMultireddit(options.name)
            .then(multi => multi.addSubreddit(options.subreddit))
            .then(resolve)
            .catch(reject);
        });
    }

    removeSubreddit(options) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(options.subreddit)) {
                reject(new RedditError("InvalidArguments", "Must provide name and subreddit."));
            }
            this._getMyMultireddit(options.name)
            .then(multi => multi.removeSubreddit(options.subreddit))
            .then(resolve)
            .catch(reject);
        });
    }

    edit() {

    }

    create() {

    }

    copy() {

    }
};
