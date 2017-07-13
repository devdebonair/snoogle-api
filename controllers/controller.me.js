const RedditController = require("./controller.reddit");

module.exports = class Me extends RedditController {
    constructor(options) {
        super(options);
    }

    async fetch() {
        try {
            let me = await this.snoo.getMe();
            let subscriptions = await this.getSubscriptions();
            let multireddits = await this.getMultireddits();
            me.hamlet_subscriptions = subscriptions;
            me.hamlet_multireddits = multireddits;
            return me;
        } catch(e) {
            throw e;
        }
    }

    async getFriends() {
        try {
            return await this.snoo.getFriends();
        } catch(e) {
            throw e;
        }
    }

    async getBlocked() {
        try {
            return await this.snoo.getBlockedUsers();
        } catch(e) {
            throw e;
        }
    }

    async getMultireddits() {
        try {
            return await this.snoo.getMyMultireddits();
        } catch(e) {
            throw e;
        }
    }

    async getSubscriptions() {
        try {
            return await this.snoo.getSubscriptions()
        } catch(e) {
            throw e;
        }
    }

    async getTrophies() {
        try {
            return await this.snoo.getMyTrophies();
        } catch(e) {
            throw e;
        }
    }

    async _getInbox(options = {}) {
        try {
            let defaults = { filter: null };
            options = this._.assign(defaults, options);
            return await this.snoo.getInbox(options);
        } catch(e) {
            throw e;
        }
    }

    async getUnreadInbox() {
        try {
            return await this._getInbox({ filter: "unread" });
        } catch(e) {
            throw e;
        }
    }

    async getInbox() {
        try {
            return await this._getInbox();
        } catch(e) {
            throw e;
        }
    }

    async getPrivateMessages() {
        try {
            return await this._getInbox({ filter: "messages" });
        } catch(e) {
            throw e;
        }
    }

    async getCommentReplies() {
        try {
            return await this._getInbox({ filter: "comments" });
        } catch(e) {
            throw e;
        }
    }

    async getSubmissionReplies() {
        try {
            return await this._getInbox({ filter: "selfreply" });
        } catch(e) {
            throw e;
        }
    }

    async getMentions() {
        try {
            return await this._getInbox({ filter: "mentions" });
        } catch(e) {
            throw e;
        }
    }

    async getSentMessages() {
        try {
            return await this.snoo.getSentMessages();
        } catch(e) {
            throw e;
        }
    }
};
