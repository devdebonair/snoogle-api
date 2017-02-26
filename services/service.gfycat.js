// For use when the api gets more documentation
// const Gfycat = require('gfycat-sdk');
// module.exports = new Gfycat({
//     clientId: "2_jVHv6U",
//     clientSecret: "nK9Fd6mwZQi7qDArJU3kb-hwMW2DeBeSmdbNIL2axQgNusg-_Wt18V-zXtlTxuN2"
// });

module.exports = require('request-promise').defaults({pool: { maxSockets: 100000}});
