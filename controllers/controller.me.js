const RedditController = require("./controller.reddit");

module.exports = class Me extends RedditController {
    constructor(options) {
        super(options);
    }

    fetch() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getMe()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getFriends() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getFriends()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getBlocked() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getBlockedUsers()
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

    getTrophies() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getMyTrophies()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    _getInbox(options = {}) {
        return new Promise((resolve, reject) => {
            let defaults = { filter: null };
            options = this._.assign(defaults, options);
            this.snoo
            .getInbox(options)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    getUnreadNotifications() {
        return new Promise((resolve, reject) => {
            this._getInbox({ filter: "unread" })
            .then(resolve)
            .catch(reject);
        });
    }

    getNotifications() {
        return new Promise((resolve, reject) => {
            this._getInbox()
            .then(resolve)
            .catch(reject);
        });
    }

    getPrivateMessages() {
        return new Promise((resolve, reject) => {
            this._getInbox({ filter: "messages" })
            .then(resolve)
            .catch(reject);
        });
    }

    getCommentReplies() {
        return new Promise((resolve, reject) => {
            this._getInbox({ filter: "comments" })
            .then(resolve)
            .catch(reject);
        });
    }

    getSubmissionReplies() {
        return new Promise((resolve, reject) => {
            this._getInbox({ filter: "selfreply" })
            .then(resolve)
            .catch(reject);
        });
    }

    getMentions() {
        return new Promise((resolve, reject) => {
            this._getInbox({ filter: "mentions" })
            .then(resolve)
            .catch(reject);
        });
    }

    getSentMessages() {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSentMessages()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
