const _ = require("lodash");

exports.format = (listing) => {
    return new Promise((resolve, reject) => {
        // Add application specific details and nest listings
        let retval = {};
        retval.isFinished = listing.isFinished;
        retval.after = null;
        if(listing.length > 0) {
            retval.after = listing[listing.length - 1].name;
        }

        // convert snoowrap class to JSON
        retval.data = listing.toJSON();

        // format each post
        retval.data.map(post => {
            console.log(post);
            return this.formatPost(post);
        });
        resolve(retval);
    });
};

// TODO: Add Test
exports.formatPost = (post) => {
    // add hamlet media
    post.hamlet_media = {};
    post.hamlet_album = [];
    post.hamlet_errors = [];

    // Remove multiple newline characters
    post.selftext = post.selftext.replace(/(\n)+/g, "\n");
    post.selftext = post.selftext.replace(/([ ]+)(?=\n)(\1*)/g, "");
    return post;
};
