const RedditController = require("./controller.reddit");

module.exports = class MultiReddit extends RedditController {
    constructor(options) {
        super(options);
    }

    _getMyMultireddit(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name."));
            }
            this.snoo
            .getMyMultireddits()
            .then(multireddits => {
                for(let multireddit of multireddits) {
                    if(multireddit.display_name === options.name) {
                        return resolve(multireddit);
                    }
                }
                return reject(new this.RedditError("NotFound", `Could not find ${options.name} in multireddits.`, 404));
            })
            .then(data => resolve(data))
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    addSubreddit(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name and subreddit."));
            }
            this._getMyMultireddit({name: options.name})
            .then(multi => multi.addSubreddit(options.subreddit))
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    removeSubreddit(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(options.subreddit)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name and subreddit."));
            }
            this._getMyMultireddit({name: options.name})
            .then(multi => multi.removeSubreddit(options.subreddit))
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    edit(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(options.edits)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name and edits."));
            }
            let promises = [];
            this._getMyMultireddit({name: options.name})
            .then(multi => {
                if(!this._.isEmpty(options.edits.title)) {
                    const titleNoSpace = options.edits.title.replace(/\s/g,'');
                    promises.push(multi.rename({newName: titleNoSpace}));
                }
                promises.push(multi.edit(options.edits));
                return Promise.all(promises);
            })
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    create(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name) || this._.isEmpty(options.description) || this._.isEmpty(options.subreddits)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name, description, and list of subreddits"));
            }
            this.snoo
            .createMultireddit(options)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    delete(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.name)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide name."));
            }
            this._getMyMultireddit({name: options.name})
            .then(multi => multi.delete())
            .then(_ => resolve({success: true}))
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    copy(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.user) || this._.isEmpty(options.user_multiname) || this._.isEmpty(options.new_multiname)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide user, multireddit name, and new multireddit name."));
            }
            this.snoo
            .getUser(options.user)
            .getMultireddit(options.user_multiname)
            .copy({newName: options.new_multiname})
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
