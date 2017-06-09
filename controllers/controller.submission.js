const flatten = require("../helpers/helper.flatten");
const RedditController = require("./controller.reddit");
const formatPost = require("../helpers/helper.listing").formatPost;

module.exports = class Submission extends RedditController {
    constructor(options) {
        super(options);
    }

    fetch(options = {}) {
        return new Promise((resolve, reject) => {
            const self = this;
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }

            function fetchMedia(post) {
                return self.fetcher
                .fetchMedia(post);
            }
            
            this.snoo
            .getSubmission(options.id)
            .fetch()
            .then((post) => {
                post.comments = flatten({replies: post.comments.toJSON()});
                return post;
            })
            .then(formatPost)
            .then(fetchMedia)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
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

    reply(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide submission id and text to send.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .reply(options.text)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    edit(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide submission id and text to update.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .edit(options.text)
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    delete(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .delete()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    hide(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .hide()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }

    unhide(options = {}) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.id)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide id for submission.", 500));
            }
            this.snoo
            .getSubmission(options.id)
            .unhide()
            .then(resolve)
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
