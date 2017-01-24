const request = require('request-promise').defaults({pool: { maxSockets: 100000}});
const mcache = require("memory-cache");
const snoowrap = require('snoowrap');
const Gfycat = require('gfycat-sdk');
const express = require("express");
const imgur = require('imgur');
const _ = require('lodash');
const app = express();
const Routes = require("./routes");

const gfycat = new Gfycat({
    clientId: "2_jVHv6U",
    clientSecret: "nK9Fd6mwZQi7qDArJU3kb-hwMW2DeBeSmdbNIL2axQgNusg-_Wt18V-zXtlTxuN2"
});

// const reddit = new snoowrap({
//     userAgent: 'nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)',
//     clientId: 'jiNIOlneh6TvXQ',
//     clientSecret: 'w_9H062IvMDAS2Pb2s2Vyl5ZecU',
//     username: 'devdebonair',
//     password: 'kiddollars'
// });

const reddit = new snoowrap({
    userAgent: 'nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/catalystlive)',
    clientId: 'MeEU261ljtCJMg',
    clientSecret: 'YQZda7J9vym-9pvT5DlpLPmxd1Y',
    username: 'devdebonair',
    password: 'kiddollars'
});



imgur.setClientId('8ef663def73ee38');

const router = new Routes({
    imgur: imgur,
    gfycat: request,
    reddit: reddit
});

const PORT = process.env.PORT || 3000;
const expirationTime = 60 * 4; // 60 seconds
const ommittedKeys = [
    'secure_media',
    'secure_media_embed',
    'secure_media_embed',
    'media',
    'media_embed',
    'selftext_html',
    'preview'
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

app.get("/", router.sendResponse());
app.get("/r/:sub/:sort", cache(expirationTime), router.getSubreddit(ommittedKeys));
app.get("/submission/:submissionId", router.getSubmission());
app.get("/frontpage/:sort", cache(expirationTime), router.getFrontPage());

app.listen(PORT, _ => {});
