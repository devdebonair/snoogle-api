const _ = require("lodash");

exports.parseStatusCode = function(message) {
    let codes = message.match(/\d{3,3}/);
    if(!_.isEmpty(codes)) {
        return codes[0];
    }
    return null;
};
