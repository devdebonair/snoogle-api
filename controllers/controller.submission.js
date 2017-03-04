const flatten = require("../helpers/helper.flatten");
const RedditController = require("./controller.reddit");

module.exports = class Submission extends RedditController {
    constructor(options) {
        super(options);
    }

    getComments(options) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id).comments
            .then(comments => comments.toJSON())
            .then(comments => {
                return { replies: comments };
            })
            .then(flatten)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    upvote(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .upvote()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    downvote(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .downvote()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    save(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .save()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    unsave(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .unsave()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    unvote(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .unvote()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
