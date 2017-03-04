const RedditController = require("./controller.reddit");

module.exports = class Comment extends RedditController {
    constructor(options) {
        super(options);
    }

    fetch(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .fetch()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    upvote(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .upvote()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    downvote(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .downvote()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    save(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .save()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    unsave(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .unsave()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    unvote(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .unvote()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    reply(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide comment id and text to send.", 500));
            }
            this.snoo
            .getComment(options.id)
            .reply(options.text)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    edit(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide comment id and text to send.", 500));
            }
            this.snoo
            .getComment(options.id)
            .edit(options.text)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    delete(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for comment.", 500));
            }
            this.snoo
            .getComment(options.id)
            .delete()
            .then(_ => resolve({success: true}))
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
