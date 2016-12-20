const url = require("url");
const _ = require("lodash");

exports.gfycat = require("./fetcher-gfycat");
exports.imgur = {};
exports.imgur.image = require("./fetcher-imgur-image");
exports.imgur.album = require("./fetcher-imgur-album");
exports.variant = require("./fetcher-variant");
exports.blank = require("./fetcher-blank");

exports.fetchMedia = function fetchMedia(listing, services) {
    let linkUrl = url.parse(listing.url);
    let hostname = linkUrl.hostname;
    let regex = /[^\/]+(?=\/$|$)/g;
    if(regex.test(listing.url)) {
        let listingID = listing.url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
        if(hostname.toLowerCase().includes('imgur')){
            if(linkUrl.pathname.includes('/a/') || linkUrl.pathname.includes('/gallery/')){
                return exports.imgur.album(services.imgur, listing, listingID);
            } else {
                return exports.imgur.image(services.imgur, listing, listingID);
            }
        } else if(hostname.toLowerCase().includes('gfycat')){
            let options = {
                uri: `https://gfycat.com/cajax/get/${listingID}`,
                json: true,
                forever: true,
                headers: { "user-agent": "nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)" }
            };
            return exports.gfycat(services.gfycat, options, listing);
        } else if(!_.isEmpty(listing.preview)) {
            return exports.variant(listing);
        } else {
            return exports.blank(listing);
        }
    }
};
