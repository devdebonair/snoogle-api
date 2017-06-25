const _ = require("lodash");
const remark = require("remark");
const remarkSqueeze = require("remark-squeeze-paragraphs");
const markdownParser = require("../markdown");
const Miner = require("../miner");
const Cache = require("../cache");

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

        let cacheKey = post.url;
        Cache
            .shared()
            .getJSON({key: cacheKey})
            .then((cache) => {
                if(!_.isEmpty(cache)) {
                    post = _.assign(post, cache);
                    return resolve(post);
                }
                miner
                    .fetch(post.url)
                    .then(media => {
                        post.hamlet_media = media;
                        if(_.isEmpty(post.hamlet_media) && !_.isEmpty(post.preview)) {
                            let preview = exports.getPreview(post);
                            post.hamlet_media.push(preview);
                        }
                        resolve(post);
                        return post;
                    })
                    .then((post) => {
                        const options = {
                            key: cacheKey,
                            value: _.pick(post, ["hamlet_media"]),
                            exp: (60 * 60 * 24 * 1) // 1 day
                        };
                        return Cache.shared().storeJSON(options);
                    })
            })
            .catch(error => {
                console.log(error);
                return resolve(post);
            });
    });
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