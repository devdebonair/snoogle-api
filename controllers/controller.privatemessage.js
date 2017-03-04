const RedditController = require("./controller.reddit");

module.exports = class PrivateMessage extends RedditController {
    constructor(options) {
        super(options);
    }

    compose(options) {
        return new Promise((resolve, reject) => {
            if(this._.isEmpty(options.to) || this._.isEmpty(options.subject) || this._.isEmpty(options.text)) {
                return reject(new this.RedditError("InvalidArguments", "Must provide to, subject and text."));
            }

            this.snoo
            .composeMessage(options)
            .then(_ => resolve({ success: true }))
            .catch(error => this.parseSnooError(error, reject));
        });
    }
};
