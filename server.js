const request = require('request-promise').defaults({pool: { maxSockets: 100000}});
const mcache = require("memory-cache");
const snoowrap = require('snoowrap');
const Gfycat = require('gfycat-sdk');
const express = require("express");
const Imgur = require('imgur');
const _ = require('lodash');
const app = express();
const routes = require("./routes");

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

const Services = { imgur: Imgur, gfycat: request, reddit: reddit };

const ommittedKeys = [
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

app.get("/", routes.sendResponse);
app.get("/r/:sub/:sort", cache(expirationTime), routes.getSubreddit(ommittedKeys, Services));

app.listen(PORT, _ => {});
