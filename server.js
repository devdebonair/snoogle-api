const Express = require("express");
const Routes = require("./routes");
const PORT = process.env.PORT || 3000;

const router = new Routes();
const app = Express();

app.get("/", router.sendResponse());
app.get("/r/:sub/:sort", router.getSubreddit());
app.get("/submission/:submissionId", router.getSubmission());
app.get("/frontpage/:sort", router.getFrontPage());
app.get("/users/:id", router.getUser());
app.get("/users/:id/submissions/:sort", router.getUserSubmissions());
app.get("/users/:id/comments/:sort", router.getUserComments());
app.post("/users/:id/friend", router.addFriend());
app.post("/users/:id/unfriend", router.addFriend());
app.get("/users/:id/trophies", router.getUserTrophies());

app.listen(PORT, _ => {});
