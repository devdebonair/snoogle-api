const RedditController = require("./controller.reddit");

module.exports = class Comment extends RedditController {
    constructor(options) {
        super(options);
    }

    async fetch(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).fetch();
        } catch(e) {
            throw e;
        }
    }

    async upvote(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).upvote();
        } catch(e) {
            throw e;
        }
    }

    async downvote(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).downvote();
        } catch(e) {
            throw e;
        }
    }

    async save(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).save();
        } catch(e) {
            throw e;
        }
    }

    async unsave(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).unsave();
        } catch(e) {
            throw e;
        }
    }

    async unvote(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).unvote();
        } catch(e) {
            throw e;
        }
    }

    async reply(options = {}) {
        if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
            throw new this.RedditError("InvalidArguments", "Must provide comment id and text to send.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).reply(options.text);
        } catch(e) {
            throw e;
        }
    }

    async edit(options = {}) {
        if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
            throw new this.RedditError("InvalidArguments", "Must provide comment id and text to update.", 500);
        }
        try {
            return await this.snoo.getComment(options.id).edit(options.text);
        } catch(e) {
            throw e;
        }
    }

    async delete(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for comment.", 500);
        }
        try {
            await this.snoo.getComment(options.id).delete();
            return {success: true};
        } catch(e) {
            throw e;
        }
    }
};
