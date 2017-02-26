exports.parseStatusCode = function(message) {
    let codes = message.match(/\d{3,3}/);
    if(codes.length > 0) {
        return codes[0];
    }
    return null;
};
