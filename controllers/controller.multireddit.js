const RedditController = require("./controller.reddit");

module.exports = class MultiReddit extends RedditController {
    constructor(options) {
        super(options);
    }

    async _getMyMultireddit(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name.");
        }
        try {
            let multireddits = await this.snoo.getMyMultireddits();
            let selectedMultireddit = null;
            for(let multireddit of multireddits) {
                if(multireddit.display_name === options.name) {
                    return multireddit;
                }
            }
            throw new this.RedditError("NotFound", `Could not find ${options.name} in multireddits.`, 404);
        } catch(e) {
            throw e;
        }
    }

    async addSubreddit(options = {}) {
        if(this._.isEmpty(options.name) || this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide name and subreddit.");
        }
        try {
            let multireddit = await this._getMyMultireddit({name: options.name});
            return await multireddit.addSubreddit(options.subreddit);
        } catch(e) {
            throw e;
        }
    }

    async removeSubreddit(options = {}) {
        if(this._.isEmpty(options.name) || this._.isEmpty(options.subreddit)) {
            throw new this.RedditError("InvalidArguments", "Must provide name and subreddit.");
        }
        try {
            let multireddit = await this._getMyMultireddit({name: options.name});
            return await multireddit.removeSubreddit(options.subreddit)
        } catch(e) {
            throw e;
        }
    }

    async edit(options = {}) {
        if(this._.isEmpty(options.name) || this._.isEmpty(options.edits)) {
            throw new this.RedditError("InvalidArguments", "Must provide name and edits.");
        }
        try {
            let promises = [];
            let multireddit = await this._getMyMultireddit({name: options.name});
            if(!this._.isEmpty(options.edits.title)) {
                const titleNoSpace = options.edits.title.replace(/\s/g,'');
                promises.push(multireddit.rename({newName: titleNoSpace}));
            }
            promises.push(multireddit.edit(options.edits));
            return await Promise.all(promises);
        } catch(e) {
            throw e;
        }
    }

    async create(options = {}) {
        if(this._.isEmpty(options.name) || this._.isEmpty(options.description) || this._.isEmpty(options.subreddits)) {
            throw new this.RedditError("InvalidArguments", "Must provide name, description, and list of subreddits");
        }
        try {
            return await this.snoo.createMultireddit(options);
        } catch(e) {
            throw e;
        }
    }

    async delete(options = {}) {
        if(this._.isEmpty(options.name)) {
            throw new this.RedditError("InvalidArguments", "Must provide name.");
        }
        try {
            let multireddit = await this._getMyMultireddit({name: options.name});
            await multireddit.delete();
            return {success: true};
        } catch(e) {
            throw e;
        }
    }

    async copy(options = {}) {
        if(this._.isEmpty(options.user) || this._.isEmpty(options.user_multiname) || this._.isEmpty(options.new_multiname)) {
            throw new this.RedditError("InvalidArguments", "Must provide user, multireddit name, and new multireddit name.");
        }
        try {
            return await this.snoo.getUser(options.user).getMultireddit(options.user_multiname).copy({newName: options.new_multiname})
        } catch(e) {
            throw e;
        }
    }
};
