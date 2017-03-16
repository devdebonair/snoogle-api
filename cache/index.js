const Redis = require("ioredis");
const options = require("../config").redis;
const Cache = require("./cache");

const redis = (() => {
	return new Redis(options);
})();

exports.shared = () => {
	return new Cache(redis);
};