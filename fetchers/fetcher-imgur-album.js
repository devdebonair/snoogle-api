const _ = require("lodash");

module.exports = function imgurAlbum(Imgur, listing, listingID) {
    return Imgur.getAlbumInfo(listingID).then(media => {
        let images = [];
        let imagesData = media.data.images;
        if(imagesData.length > 1) {
            for(let image of imagesData){
                if(image.type === "image/gif") {
                    images.push(extractImgurVideo(image));
                } else {
                    images.push(extractImgurImage(image));
                }
            }
            listing.hamlet_media = images;
        } else if(imagesData.length === 1) {
            if(imagesData[0].type === "image/gif") {
                listing.hamlet_media = extractImgurVideo(imagesData[0]);
            } else {
                listing.hamlet_media = extractImgurImage(imagesData[0]);
            }
        }
        return listing;
    });
};

let extractImgurImage = function(data) {
    let pathRegex = /[^\/]+(?=\/$|$)/g;
    let extensionRegex = /\.[A-Za-z]+/;
    let extension = null;
    let sizes = {};
    let retval = {};
    if(pathRegex.test(data.link)) {
        extension = data.link.match(pathRegex)[0].match(extensionRegex)[0];
    }
    if(extension !== null){
        let newLink = data.link.replace(extension, "");
        let sizeIndicators = ['s','m','l'];
        for(let indicator of sizeIndicators) {
            switch (indicator) {
                case "s":
                    sizes.small = newLink + indicator + extension;
                    break;
                case "m":
                    sizes.medium = newLink + indicator + extension;
                    break;
                case "l":
                    sizes.large = newLink + indicator + extension;
                    break;
                default:
                    break;
            }
        }
    }

    retval.type = "photo";
    retval.width = data.width;
    retval.height = data.height;
    retval.url = data.link;
    retval.description = data.description;
    retval.sizes = _.isEmpty(sizes) ? null : sizes;

    return retval;
};

let extractImgurVideo = function(data) {
    let pathRegex = /[^\/]+(?=\/$|$)/g;
    let extensionRegex = /\.[A-Za-z]+/;
    let extension = null;
    if(pathRegex.test(data.link)) {
        extension = data.link.match(pathRegex)[0].match(extensionRegex)[0];
    }
    return {
        type: "video",
        width: data.width,
        height: data.height,
        poster: null,
        gif: `${data.link.replace(extension, "")}.gif`,
        url: data.mp4,
        description: data.description
    };
};
