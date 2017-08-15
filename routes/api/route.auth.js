const Auth = require("../../controllers").Auth;
const account = require("../../config").reddit;
const _ = require("lodash");

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

    router.route("/auth/redirectUri")
    	.get((req, res) => {
    		res.redirect("uri");
    	});

    router.route("/auth/token")
        .get((req, res) => {
        	let code = req.get("AuthCode");
        	if(_.isEmpty(code)){ return res.status(401).json({message: "Must send authorizaiton code in header."}); }
        	let options = _.assign({code: code}, account);
            const auth = new Auth(options);
            auth.getTokens()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });
};
