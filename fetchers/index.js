const url = require("url");
const _ = require("lodash");

let blank = require("./fetcher-blank");
let variant = require("./fetcher-variant");
let gfycat = require("./fetcher-gfycat");
let imgur = {
    image: require("./fetcher-imgur-image"),
    album: require("./fetcher-imgur-album")
};

module.exports = class Fetcher {

    constructor(services) {
        this.services = services;
        this.gfycat = gfycat;
        this.imgur = imgur;
        this.variant = variant;
        this.blank = blank;
    }

    fetchAllMedia(listings) {
        let promises = [];
        for(let listing of listings) {
            promises.push(this.fetchMedia(listing));
        }
        return Promise.all(promises);
    }

    fetchMedia(listing) {
        let linkUrl = url.parse(listing.url);
        let hostname = linkUrl.hostname;
        let regex = /[^\/]+(?=\/$|$)/g;
        if(regex.test(listing.url)) {
            let listingID = listing.url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
            if(hostname.toLowerCase().includes('imgur')){
                if(linkUrl.pathname.includes('/a/') || linkUrl.pathname.includes('/gallery/')){
                    return this.imgur.album(this.services.imgur, listing, listingID);
                } else {
                    return this.imgur.image(this.services.imgur, listing, listingID);
                }
            } else if(hostname.toLowerCase().includes('gfycat')){
                let options = {
                    uri: `https://gfycat.com/cajax/get/${listingID}`,
                    json: true,
                    forever: true,
                    headers: { "user-agent": "nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)" }
                };
                return this.gfycat(this.services.gfycat, options, listing);
            } else if(!_.isEmpty(listing.preview)) {
                return this.variant(listing);
            } else {
                return this.blank(listing);
            }
        }
    }
};
