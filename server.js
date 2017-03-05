const Express = require("express");
const MethodOverride = require("method-override");
const BodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const routes = require("./routes");

const app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));
app.use(MethodOverride());

routes.connect(app);

// app.get("/", router.sendResponse());
//
// app.get("/frontpage/:sort", router.getFrontPage());
// app.get("/subreddit/:name", router.getSubreddit());
// app.get("/subreddit/:name/listing/:sort", router.getListing());
// app.post("/subreddit/:name/subscribe", router.subscribeSubreddit());
// app.post("/subreddit/:name/unsubscribe", router.unsubscribeSubreddit());
// app.post("/subreddit/:name/submit/text", router.submitText());
// app.post("/subreddit/:name/submit/link", router.submitLink());
//
// app.get("/submission/:id", router.getSubmission());
// app.post("/submission/:id/upvote", router.upvoteSubmission());
// app.post("/submission/:id/downvote", router.downvoteSubmission());
// app.post("/submission/:id/save", router.saveSubmission());
// app.post("/submission/:id/unsave", router.unsaveSubmission());
// app.post("/submission/:id/unvote", router.unvoteSubmission());
//
// app.get("/users/:id", router.getUser());
// app.get("/users/:id/trophies", router.getUserTrophies());
// app.get("/users/:id/comments/:sort", router.getUserComments());
// app.get("/users/:id/submissions/:sort", router.getUserSubmissions());
// app.post("/users/:id/friend", router.addFriend());
// app.post("/users/:id/unfriend", router.addFriend());

app.listen(PORT, _ => {});
