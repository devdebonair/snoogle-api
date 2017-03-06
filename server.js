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

app.listen(PORT, _ => {});
