const request = require('request-promise').defaults({pool: { maxSockets: 100000}});
const mcache = require("memory-cache");
const Fetcher = require("./fetchers");
const snoowrap = require('snoowrap');
const Gfycat = require('gfycat-sdk');
const express = require("express");
const Imgur = require('imgur');
const _ = require('lodash');
const app = express();

const Services = { imgur: Imgur, gfycat: request };
const PORT = process.env.PORT || 3000;
const expirationTime = 60 * 4; // 60 seconds

const gfycat = new Gfycat({
    clientId: "2_jVHv6U",
    clientSecret: "nK9Fd6mwZQi7qDArJU3kb-hwMW2DeBeSmdbNIL2axQgNusg-_Wt18V-zXtlTxuN2"
});

const reddit = new snoowrap({
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

app.get("/", (req, res) => {
    return res.status(200).send("Server response.");
});

app.get("/r/:sub/:sort", cache(expirationTime), function(req, res){
    let subreddit = req.params.sub.toLowerCase();
    let sort = req.params.sort.toLowerCase();
    let sub = reddit.getSubreddit(subreddit);

    switch (sort) {
        case "new":
            sub = sub.getNew(); break;
        case "hot":
            sub = sub.getHot(); break;
        case "rising":
            sub = sub.getRising(); break;
        case "top":
            sub = sub.getTop(); break;
        case "controversial":
            sub = sub.getControversial(); break;
        default:
            return res.status(404).json({error: "Invalid Sort Type"}).end();
    }

    function format(data) { return JSON.parse(JSON.stringify(data)); }
    function removeOmittedKeys(data) { return omitKeys(data, ommittedKeys); }
    function removePreviewKey(data) { return omitKeys(data, ["preview"]); }
    function fetchMedia(data) { return Fetcher.fetchAllMedia(data, Services); }

    function omitKeys(data, keys) {
        return data.map(listing => {
            return _.omit(listing, keys);
        });
    }

    function addHamletMedia(data) {
        return data.map(listing => {
            listing.hamlet_media = null;
            return listing;
        });
    }

    sub
        .map(format)
        .then(removeOmittedKeys)
        .then(addHamletMedia)
        .then(fetchMedia)
        .then(removePreviewKey)
        .then(res.json)
        .catch(res.status(404).send);
});

app.listen(PORT, _ => {});
