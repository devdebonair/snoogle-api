const _ = require("lodash");
const remark = require("remark");
const remarkSqueeze = require("remark-squeeze-paragraphs");
const markdownParser = require("../markdown");
const Miner = require("../miner");

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
            return this.formatPost(post);
        });
        resolve(retval);
    });
};

// TODO: Add Test
exports.formatPost = (post) => {
    // add hamlet media
    post.hamlet_media = [];
    post.hamlet_errors = [];

    // Remove multiple newline characters
    // post.selftext = post.selftext.replace(/(\n)+/g, "\n");
    // post.selftext = post.selftext.replace(/([ ]+)(?=\n)(\1*)/g, "");

    // Parse markdown into syntax tree
    post.selftext_parsed = markdownParser(remark().use(remarkSqueeze).parse(post.selftext));
    
    return post;
};

exports.fetchMedia = (post) => {
    return new Promise((resolve, reject) => {
        let miner = new Miner();
        post.hamlet_media = [];
        
        miner
        .fetch(post.url)
        .then(media => {
            post.hamlet_media = media;
            if(_.isEmpty(post.hamlet_media) && !_.isEmpty(post.preview)) {
                post.hamlet_media.push(exports.getPreview(post));
            }
            resolve(post);
        })
        .catch(error => {
            console.log(error);
            return resolve(post);
        });
    });
};

exports.getPreview = (post) => {
    let images = post.preview.images;
    if(!_.isEmpty(images)){
        let imageData = images[0];
        if(imageData.variants.mp4){
            return extractVariant(imageData.variants.mp4, 'video');
        }
        return extractVariant(imageData, 'photo');
    }
    return [];
}

let extractVariant = function(data, type){
    let source = data.source;
    let resolutions = data.resolutions;
    let retval = {};
    retval.type = type;
    retval.height = source.height;
    retval.width = source.width;
    retval.url = source.url;
    retval.description = null;
    retval.sizes = null;
    if(!_.isEmpty(resolutions) && resolutions.length >= 3) {
        let middleIndex = Math.ceil(resolutions.length / 2);
        let lastIndex = resolutions.length - 1;
        retval.sizes = {};
        retval.sizes.small = resolutions[0].url;
        retval.sizes.medium = resolutions[middleIndex].url;
        retval.sizes.large = resolutions[lastIndex].url;
    }
    return retval;
};
