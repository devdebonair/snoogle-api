const User = require("../../controllers").User;
const account = require("../../config").accounts.test;

module.exports = (router) => {
    router.route("/users/:name")
        .get((req, res) => {
            const user = new User(account);
            user.fetch({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/trophies")
        .get((req, res) => {
            const user = new User(account);
            user.getTrophies({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/comments/:sort")
        .get((req, res) => {
            const user = new User(account);
            user.getComments({name: req.params.name, sort: req.params.sort})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/submissions/:sort")
        .get((req, res) => {
            const user = new User(account);
            user.getSubmissions({name: req.params.name, sort: req.params.sort})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/friend")
        .post((req, res) => {
            const user = new User(account);
            user.addFriend({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/users/:name/unfriend")
        .post((req, res) => {
            const user = new User(account);
            user.removeFriend({name: req.params.name})
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code).json({type: error.name, message: error.message, code: error.code});
            });
        });
};
