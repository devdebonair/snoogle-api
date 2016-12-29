const _ = require("lodash");

module.exports = function variantPromiser(listing) {
    return new Promise(function(resolve, reject){
        let images = listing.preview.images;
        if(!_.isEmpty(images)){
            let imageData = images[0];
            if(imageData.variants.mp4){
                listing.hamlet_media = extractVariant(imageData.variants.mp4, 'video');
            } else {
                listing.hamlet_media = extractVariant(imageData, 'photo');
            }
        }
        resolve(listing);
    });
};

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
