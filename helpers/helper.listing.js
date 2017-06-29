const _ = require("lodash");
const remark = require("remark");
const remarkSqueeze = require("remark-squeeze-paragraphs");
const markdownParser = require("../markdown");
const Miner = require("../miner");
const Cache = require("../cache");

exports.format = (listing) => {

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

    return retval;
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

exports.fetchMedia = async (post) => {
    let miner = new Miner();
    let cacheKey = post.url;
    post.hamlet_media = [];
    let cache = null;

    try {
        cache = await Cache.shared().getJSON({key: cacheKey});
    } catch(e) {
        console.log(e);
    }

    if(!_.isEmpty(cache)) {
        post = _.assign(post, cache);
        return post;
    }

    let media = await miner.fetch(post.url);
    post.hamlet_media = media;

    let hasEmptyMediaWithPreview = (_.isEmpty(post.hamlet_media) && !_.isEmpty(post.preview));
    if(hasEmptyMediaWithPreview) {
        let preview = exports.getPreview(post);
        post.hamlet_media.push(preview);
    }

    const options = {
        key: cacheKey,
        value: _.pick(post, ["hamlet_media"]),
        exp: (60 * 60 * 24 * 1) // 1 day
    };

    Cache.shared().storeJSON(options).then().catch(error => {
        console.log(error);
    });

    return post;


    // return new Promise((resolve, reject) => {
    //     let miner = new Miner();
    //     let cacheKey = post.url;
    //     post.hamlet_media = [];

    //     Cache
    //         .shared()
    //         .getJSON({key: cacheKey})
    //         .then((cache) => {
    //             if(!_.isEmpty(cache)) {
    //                 post = _.assign(post, cache);
    //                 resolve(post);
    //                 return post;
    //             }
    //             return miner
    //                 .fetch(post.url)
    //                 .then(media => {
    //                     post.hamlet_media = media;
    //                     return post;
    //                 })
    //                 .then(post => {
    //                     let emptyMediaWithPreview = (_.isEmpty(post.hamlet_media) && !_.isEmpty(post.preview));
    //                     if(emptyMediaWithPreview) {
    //                         let preview = exports.getPreview(post);
    //                         post.hamlet_media.push(preview);
    //                     }
    //                     resolve(post);
    //                     return post;
    //                 })
    //         })
    //         .then((post) => {
    //             const options = {
    //                 key: cacheKey,
    //                 value: _.pick(post, ["hamlet_media"]),
    //                 exp: (60 * 60 * 24 * 1) // 1 day
    //             };
    //             Cache.shared().storeJSON(options).then().catch(error => {
    //                 console.log(error);
    //             });
    //             return post;
    //         })
    //         .catch(error => {
    //             // TODO: Fails if inital cache errors out. Should fetch from miner if fail.
    //             console.log(error);
    //             return resolve(post);
    //         });
    // });
};

exports.getPreview = (post) => {
    function extractVariant(data, type){
        let source = data.source;
        let resolutions = data.resolutions;
        let retval = {};
        retval.type = type;
        retval.height = source.height;
        retval.width = source.width;
        retval.url = source.url;
        retval.description = null;
        retval.sizes = {
            small: null,
            medium: null,
            large: null,
            huge: null
        };
        if(!_.isEmpty(resolutions) && resolutions.length >= 3) {
            let middleIndex = Math.ceil(resolutions.length / 2);
            let lastIndex = resolutions.length - 1;
            retval.sizes.small = resolutions[0].url;
            retval.sizes.medium = resolutions[middleIndex].url;
            retval.sizes.large = resolutions[lastIndex].url;
            retval.sizes.huge = null;
        }

        // Check if url is an image. (Usually has higher quality than preview)
        // If all else fails, and the source url for preview exists, use that
        //      to replace missing size variations.
        if((/\.(gif|jpg|jpeg|png)$/i).test(post.url)) {
            retval.sizes.huge = post.url;
        } else if(retval.url) {
            retval.sizes.huge = retval.url;
        }
        return retval;
    };

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