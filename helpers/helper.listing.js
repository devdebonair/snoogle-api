const _ = require("lodash");

exports.format = (listing, ommittedKeys) => {
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

        // add hamlet media
        retval.data.map(post => {
            post.hamlet_media = {};
            post.hamlet_album = [];
            post.hamlet_errors = [];
            return post;
        });

        // Remove specified keys
        retval.data = retval.data.map(post => {
            return _.omit(post, ommittedKeys);
        });

        // Remove multiple newline characters
        retval.data = retval.data.map(post => {
            post.selftext = post.selftext.replace(/(\n)+/g, "\n");
            post.selftext = post.selftext.replace(/([ ]+)(?=\n)(\1*)/g, "");
            return post;
        });
        resolve(retval);
    });
};
