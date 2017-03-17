const fs = require("fs");
const router = require("express").Router();

module.exports = function(app) {
    const directory = fs.readdirSync(__dirname);
    directory.forEach((file) => {
        if(file === 'index.js') { return; }
        require(`./${file}`)(router);
    });
    app.use('/v1/', router);
};
