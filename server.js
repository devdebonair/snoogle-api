const snoowrap = require('snoowrap');
const url = require('url');
const Imgur = require('imgur');
const Gfycat = require('gfycat-sdk');
const request = require('request-promise').defaults({pool: { maxSockets: 100000}});
const _ = require('lodash');

const gfycat = new Gfycat({
    clientId: "2_jVHv6U",
    clientSecret: "nK9Fd6mwZQi7qDArJU3kb-hwMW2DeBeSmdbNIL2axQgNusg-_Wt18V-zXtlTxuN2"
});
const r = new snoowrap({
  userAgent: 'nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)',
  clientId: 'jiNIOlneh6TvXQ',
  clientSecret: 'w_9H062IvMDAS2Pb2s2Vyl5ZecU',
  username: 'devdebonair',
  password: 'kiddollars'
});

Imgur.setClientId('8ef663def73ee38');

let ommittedKeys = [
    'secure_media',
    'secure_media_embed',
    'secure_media_embed',
    'media',
    'media_embed',
    'selftext_html'
];

let extractGfycatVideo = function(data) {
    return {
        type: "video",
        width: data.width,
        height: data.height,
        poster: data.mobilePosterUrl,
        gif: data.max2mbGif,
        url: data.mobileUrl,
        description: ""
    };
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

let promiser = function(promise, listing) {
    return promise.then(media => {
        listing.hamlet_media = media;
        return listing;
    });
};

let gfyPromiser = function(promise, listing) {
    return promise.then(media => {
        let gfyItem = media.gfyItem;
        listing.hamlet_media = extractGfycatVideo(gfyItem);
        return listing;
    });
};

let imgurPromiser = function(promise, listing) {
    return promise.then(media => {
        let data = media.data;
        if(data.type === "image/gif") {
            listing.hamlet_media = extractImgurVideo(data);
        } else {
            listing.hamlet_media = extractImgurImage(data);
        }
        return listing;
    });
};

let imgurAlbumPromiser = function(promise, listing) {
    return promise.then(media => {
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

let blankPromise = function(listing){
    return new Promise(function(resolve, reject){
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
    retval.description = "";
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

let variantPromiser = function(listing) {
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

let extractMedia = function(data) {
    let promises = [];
    for(let listing of data) {
        let linkUrl = url.parse(listing.url);
        let hostname = linkUrl.hostname;
        let regex = /[^\/]+(?=\/$|$)/g;
        if(regex.test(listing.url)) {
            let listingID = listing.url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
            if(hostname.toLowerCase().includes('imgur')){
                if(linkUrl.pathname.includes('/a/') || linkUrl.pathname.includes('/gallery/')){
                    promises.push(imgurAlbumPromiser(Imgur.getAlbumInfo(listingID), listing));
                } else {
                    promises.push(imgurPromiser(Imgur.getInfo(listingID), listing));
                }
            } else if(hostname.toLowerCase().includes('gfycat')){
                let options = {
                    uri: `https://gfycat.com/cajax/get/${listingID}`,
                    json: true,
                    headers: { "user-agent": "nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)" }
                };
                promises.push(gfyPromiser(request(options), listing));
            } else if(!_.isEmpty(listing.preview)) {
                promises.push(variantPromiser(listing));
            } else {
                promises.push(blankPromise(listing));
            }
        }
    }
    return Promise.all(promises);
};

var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            return res.json(cachedBody);
        } else {
            res.jsonResponse = res.json;
            res.json = (body) => {
                mcache.put(key, body, duration * 1000);
                res.jsonResponse(body);
            };
            next();
        }
    };
};

let express = require("express");
let app = express();
let mcache = require("memory-cache");
let expirationTime = 60 * 4; // 60 seconds

app.get("/", (req, res) => {
    return res.status(200).send("Server response.");
});

app.get("/subreddit/:sub/:sort", cache(expirationTime), function(req, res){
    let sub = r.getSubreddit(req.params.sub);
    let sort = req.params.sort;
    switch (sort) {
        case "new":
            sub = sub.getNew();
            break;
        case "hot":
            sub = sub.getHot();
            break;
        case "rising":
            sub = sub.getRising();
            break;
        case "top":
            sub = sub.getTop();
            break;
        default:
            return res.status(404).json({message: "Invalid Sort Type"}).end();
    }
    sub
        .map(data => JSON.parse(JSON.stringify(data)))
        .then(data => data.map(listing => _.omit(listing, ommittedKeys)))
        .then(data => data.map(listing => {
            listing.hamlet_media = null;
            return listing;
        }))
        .then(extractMedia)
        .then(data => data.map(listing => _.omit(listing, ['preview'])))
        .then(data => res.json(data))
        .catch(error => {
            res.status(404).json({error: "Something went wrong."});
        });
});

app.listen(3000, function(){
    console.log("Listening on port 3000.");
});
