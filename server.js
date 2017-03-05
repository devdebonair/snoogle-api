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


// app.get("/submission/:id", router.getSubmission());
// app.post("/submission/:id/upvote", router.upvoteSubmission());
// app.post("/submission/:id/downvote", router.downvoteSubmission());
// app.post("/submission/:id/save", router.saveSubmission());
// app.post("/submission/:id/unsave", router.unsaveSubmission());
// app.post("/submission/:id/unvote", router.unvoteSubmission());
//


app.listen(PORT, _ => {});
