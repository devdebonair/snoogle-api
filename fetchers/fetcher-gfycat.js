module.exports = function gfycat(request, options, listing) {
    let extractGfycatVideo = function(data) {
        return {
            type: "video",
            width: data.width,
            height: data.height,
            poster: data.mobilePosterUrl,
            gif: data.max2mbGif,
            url: data.mobileUrl,
            description: null
        };
    };

    return request(options).then(media => {
        let gfyItem = media.gfyItem;
        listing.hamlet_media = extractGfycatVideo(gfyItem);
        return listing;
    });
};
