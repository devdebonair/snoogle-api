const Express = require("express");
const mcache = require("memory-cache");
const Routes = require("./routes");
const Reddit = require("./services/service.reddit");
const Imgur = require("./services/service.imgur");
const Gfycat = require("./services/service.gfycat");
const PORT = process.env.PORT || 3000;
const expirationTime = 60 * 4; // 60 seconds
const router = new Routes({
    imgur: Imgur,
    gfycat: Gfycat,
    reddit: Reddit
});

const app = Express();

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
