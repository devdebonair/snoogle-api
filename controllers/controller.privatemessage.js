const RedditController = require("./controller.reddit");

module.exports = class PrivateMessage extends RedditController {
    constructor(options) {
        super(options);
    }

    async compose(options = {}) {
        if(this._.isEmpty(options.to) || this._.isEmpty(options.subject) || this._.isEmpty(options.text)) {
            throw new this.RedditError("InvalidArguments", "Must provide to, subject and text.");
        }
        try {
            await this.snoo.composeMessage(options);
            return { success: true };
        } catch(e) {
            throw e;
        }
    }

    async delete(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id of private message.");
        }
        try {
            await this.snoo.getMessage(options.id).deleteFromInbox();
            return { success: true };
        } catch(e) {
            throw e;
        }
    }

    async fetch(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id of private message.");
        }
        try {
            return await this.snoo.getMessage(options.id).fetch();
        } catch(e) {
            throw e;
        }
    }

    async reply(options = {}) {
        if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
            throw new this.RedditError("InvalidArguments", "Must provide id of private message and text to send.");
        }
        try {
            return await this.snoo.getMessage(options.id).reply(options.text);
        } catch(e) {
            throw e;
        }
    }
};
