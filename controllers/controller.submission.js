const flatten = require("../helpers/helper.flatten");
const RedditController = require("./controller.reddit");

module.exports = class Submission extends RedditController {

    constructor(options) {
        super(options);
    }

    getComments(submissionId, options) {
        return new Promise((resolve, reject) => {
            this.snoo
            .getSubmission(submissionId).comments
            .catch(error => {
                let code = snoowrapHelper.parseStatusCode(error.message);
                reject(new RedditError(this.errors.reddit.name, this.errors.reddit.message, code));
            })
            .then(comments => comments.toJSON())
            .then(comments => {
                return { replies: comments };
            })
            .then(flatten)
            .then(comments => {
                if(this._.isEmpty(options.ommittedKeys)) {
                    return comments;
                }
                return comments.map(comment => {
                    return this._.omit(comment, options.ommittedKeys);
                });
            })
            .then(resolve)
            .catch(reject);
        });
    }

};