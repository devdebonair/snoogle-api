const fs = require("fs");

exports.connect = function(app) {
    const directory = fs.readdirSync(__dirname);
    directory.forEach((file) => {
        const path = `${__dirname}/${file}`;
        if(fs.lstatSync(path).isDirectory()) {
            require(`./${file}`)(app);
        }
    });
};
