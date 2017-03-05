// For use when the api gets more documentation
// const Gfycat = require('gfycat-sdk');
// const options = require("../config").gfycat;
//
// module.exports = new Gfycat({
//     clientId: gfycat.clientId,
//     clientSecret: gfycat.clientSecret
// });

const request = require('request-promise');

module.exports = request.defaults({
    pool: { maxSockets: 100000 }
});
