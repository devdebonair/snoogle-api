const Express = require("express");
const mcache = require("memory-cache");
const Routes = require("./routes");
const PORT = process.env.PORT || 3000;
const expirationTime = 60 * 4; // 60 seconds

const router = new Routes();
const app = Express();

app.get("/", router.sendResponse());
app.get("/r/:sub/:sort", router.getSubreddit());
app.get("/submission/:submissionId", router.getSubmission());
app.get("/frontpage/:sort", router.getFrontPage());
app.get("/users/:id", router.getUser());
app.get("/users/:id/submissions/:sort", router.getUserSubmissions());

app.listen(PORT, _ => {});
