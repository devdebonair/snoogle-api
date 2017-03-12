const options = require("../config").redis.local;
const Cache = require("./cache");

const cache = (() => {
    return new Cache(options);
})();

exports.shared = cache;

exports.create = (options) => {
    return new Cache(options);
};
