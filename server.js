const Express = require("express");
const mcache = require("memory-cache");
const Routes = require("./routes");
const PORT = process.env.PORT || 3000;
const expirationTime = 60 * 4; // 60 seconds

const router = new Routes();
const app = Express();

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
app.get("/r/:sub/:sort", cache(expirationTime), router.getSubreddit());
app.get("/submission/:submissionId", router.getSubmission());
app.get("/frontpage/:sort", cache(expirationTime), router.getFrontPage());

app.listen(PORT, _ => {});
