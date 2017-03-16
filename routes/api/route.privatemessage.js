const PrivateMessage = require("../../controllers").PrivateMessage;
const account = require("../../config").reddit;

module.exports = (router) => {
    router.route("/message")
        .post((req, res) => {
            const pm = new PrivateMessage(account);
            const options = {to: req.body.to, subject: req.body.subject, text: req.body.text};
            pm.compose(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/message/:id")
        .get((req, res) => {
            const pm = new PrivateMessage(account);
            const options = {id: req.params.id};
            pm.fetch(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        })
        .delete((req, res) => {
            const pm = new PrivateMessage(account);
            const options = {id: req.params.id};
            pm.delete(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });

    router.route("/message/:id/reply")
        .post((req, res) => {
            const pm = new PrivateMessage(account);
            const options = {id: req.params.id, text: req.body.text};
            pm.reply(options)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(error => {
                return res.status(error.code)
                .json({type: error.name, message: error.message, code: error.code});
            });
        });
};
