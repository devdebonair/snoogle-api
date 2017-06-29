const flatten = require("../helpers/helper.flatten");
const RedditController = require("./controller.reddit");
const formatPost = require("../helpers/helper.listing").formatPost;
const fetchMedia = require("../helpers/helper.listing").fetchMedia;

module.exports = class Submission extends RedditController {
    constructor(options) {
        super(options);
    }

    async fetch(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            let submission = await this.snoo.getSubmission(options.id).fetch();
            submission.comments = flatten({replies: submission.comments.toJSON()});
            let formattedPost = formatPost(submission);
            let postWithMedia = await fetchMedia(formattedPost);
            return postWithMedia;
        } catch(e) {
            throw e;
        }
    }

    async getComments(options) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            let comments = await this.snoo.getSubmission(options.id).comments;
            let commentsParsed = comments.toJSON();
            let replies = {replies: comments};
            let flattenedComments = flatten(replies);
            return flattenedComments;
        } catch(e) {
            throw e;
        }
    }

    async upvote(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).upvote();
        } catch(e) {
            throw e;
        }
    }

    async downvote(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).downvote();
        } catch(e) {
            throw e;
        }
    }

    async save(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).save();
        } catch(e) {
            throw e;
        }
    }

    async unsave(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).unsave();
        } catch(e) {
            throw e;
        }
    }

    async unvote(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).unvote();
        } catch(e) {
            throw e;
        }
    }

    async reply(options = {}) {
        if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
            throw new this.RedditError("InvalidArguments", "Must provide submission id and text to send.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).reply(options.text);
        } catch(e) {
            throw e;
        }
    }

    async edit(options = {}) {
        if(this._.isEmpty(options.id) || this._.isEmpty(options.text)) {
            throw new this.RedditError("InvalidArguments", "Must provide submission id and text to update.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).edit(options.text);
        } catch(e) {
            throw e;
        }
    }

    async delete(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).delete();
        } catch(e) {
            throw e;
        }
    }

    async hide(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).hide();
        } catch(e) {
            throw e;
        }
    }

    async unhide(options = {}) {
        if(this._.isEmpty(options.id)) {
            throw new this.RedditError("InvalidArguments", "Must provide id for submission.", 500);
        }
        try {
            return await this.snoo.getSubmission(options.id).unhide();
        } catch(e) {
            throw e;
        }
    }
};
