const Auth = require("../../controllers").Auth;
const account = require("../../config").reddit;

module.exports = (router) => {
    router.route("/auth/url")
        .get((req, res) => {
            const auth = new Auth(account);
            auth.getAuthUrl()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });
};
