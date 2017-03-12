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

const Cache = require("../cache").shared;

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
            let promises = listings.map((listing) => {
                return this.fetchMedia(listing);
            });
            Promise
            .all(promises)
            .then((posts) => {
                for(let post of posts) {
                    if(!_.isEmpty(post.hamlet_media) || !_.isEmpty(post.hamlet_album)) {
                        let expireTime = 60 * 60 * 24; // 1 day
                        const options = {
                            key: post.url,
                            value: _.pick(post, ["hamlet_media", "hamlet_album"]),
                            exp: expireTime
                        };
                        Cache.storeJSON(options).then().catch(reject);
                    }
                }
                resolve(posts);
            })
            .catch(reject);
        });
    }

    fetchMedia(listing) {

        return Cache.getJSON({key: listing.url}).then((cache) => {
            if(!_.isEmpty(cache)) {
                listing = _.assign(listing, cache);
                return this.blank(listing);
            }
            let linkUrl = url.parse(listing.url);
            let hostname = linkUrl.hostname;
            let regex = /[^\/]+(?=\/$|$)/g;
            if(regex.test(listing.url)) {
                let mediaID = listing.url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
                if(hostname.toLowerCase().includes('imgur')){
                    if(linkUrl.pathname.includes('/a/')){
                        return this.imgur
                        .album(this.services.imgur, listing, mediaID)
                        .catch((error) => {
                            listing.hamlet_errors.push(error);
                            return listing;
                        });
                    } else if(linkUrl.pathname.includes('/gallery/')){
                        return this.imgur
                        .album(this.services.imgur, listing, mediaID)
                        .catch((error) => {
                            listing.hamlet_errors.push(error);
                            return listing;
                        });
                    } else {
                        return this.imgur
                        .image(this.services.imgur, listing, mediaID)
                        .catch((error) => {
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
                    return this.gfycat(this.services.gfycat, options, listing)
                    .catch((error) => {
                        listing.hamlet_errors.push(error);
                        return listing;
                    });
                } else if(!_.isEmpty(listing.preview)) {
                    return this.variant(listing);
                } else {
                    return this.blank(listing);
                }
            }
        });
    }
};
