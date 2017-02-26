const url = require("url");
const _ = require("lodash");

const blank = require("./fetcher-blank");
const variant = require("./fetcher-variant");
const gfycat = require("./fetcher-gfycat");
const imgur = {
    image: require("./fetcher-imgur-image"),
    album: require("./fetcher-imgur-album")
};

const Imgur = require("../services/service.imgur");
const Gfycat = require("../services/service.gfycat");

const Cache = require("memory-cache");

module.exports = class Fetcher {

    constructor() {
        this.services = {
            imgur: Imgur,
            gfycat: Gfycat
        };
        this.gfycat = gfycat;
        this.imgur = imgur;
        this.variant = variant;
        this.blank = blank;
    }

    fetchAllMedia(listings) {
        return new Promise((resolve, reject) => {
            let promises = [];
            for(let listing of listings) {
                let cachedMedia = Cache.get(listing.url);
                promises.push(this.fetchMedia(listing));
            }
            Promise.all(promises)
            .then(posts => {
                for(let post of posts) {
                    if(!_.isEmpty(post.hamlet_media) || !_.isEmpty(post.hamlet_album)) {
                        let expireTime = 1000 * 60 * 60 * 24; // 1 day
                        Cache.put(post.url, _.pick(post, ["hamlet_media", "hamlet_album"], expireTime));
                    }
                }
                resolve(posts);
            })
            .catch(reject);
        });
    }

    fetchMedia(listing) {

        let cachedMedia = Cache.get(listing.url);
        if(!_.isEmpty(cachedMedia)) {
            listing = _.assign(listing, cachedMedia);
            return this.blank(listing);
        }

        let linkUrl = url.parse(listing.url);
        let hostname = linkUrl.hostname;
        let regex = /[^\/]+(?=\/$|$)/g;
        if(regex.test(listing.url)) {
            let mediaID = listing.url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
            if(hostname.toLowerCase().includes('imgur')){
                if(linkUrl.pathname.includes('/a/')){
                    return this.imgur.album(this.services.imgur, listing, mediaID).catch((error) => {
                        listing.hamlet_errors.push(error);
                        return listing;
                    });
                } else if(linkUrl.pathname.includes('/gallery/')){
                    return this.imgur.album(this.services.imgur, listing, mediaID).catch((error) => {
                        listing.hamlet_errors.push(error);
                        return listing;
                    });
                } else {
                    return this.imgur.image(this.services.imgur, listing, mediaID).catch((error) => {
                        listing.hamlet_errors.push(error);
                        return listing;
                    });
                }
            } else if(hostname.toLowerCase().includes('gfycat')){
                let options = {
                    uri: `https://gfycat.com/cajax/get/${mediaID}`,
                    json: true,
                    forever: true,
                    headers: { "user-agent": "nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)" }
                };
                return this.gfycat(this.services.gfycat, options, listing).catch((error) => {
                    listing.hamlet_errors.push(error);
                    return listing;
                });
            } else if(!_.isEmpty(listing.preview)) {
                return this.variant(listing);
            } else {
                return this.blank(listing);
            }
        }
    }
};
