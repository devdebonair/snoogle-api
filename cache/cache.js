const Redis = require("ioredis");
const _ = require("lodash");
const RedditError = require("../helpers/RedditError");

module.exports = class Cache {
    constructor(options) {
        this.redis = new Redis(options);
    }

    storeManyJSONHash(items) {
        return new Promsie((resolve, reject) => {
            let pipeline = this.redis.pipeline();
            for(let item of items) {
                pipeline.hmset(options.hash, options.key, valueToStore, "EX", options.exp);
            }
            pipeline.exec()
            .then(resolve)
            .catch(reject);
        });
    }

    storeJSONHash(options = {exp: 3600}) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.hash) || _.isEmpty(options.key) || _.isEmpty(options.value)) {
                return resolve(null);
            }
            const valueToStore = JSON.stringify(options.value);
            return this.redis
            .hmset(options.hash, options.key, valueToStore, "EX", options.exp)
            .then(resolve)
            .catch(reject);
        });
    }

    getJSONHash(options) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.map) || _.isEmpty(options.key)) {
                return resolve(null);
            }
            return this.redis
            .get(options.key)
            .then(JSON.parse)
            .then(resolve)
            .catch(reject);
        });
    }

    storeJSON(options = { exp: 3600 }) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.key) || _.isEmpty(options.value)) {
                return resolve(null);
            }
            const valueToStore = JSON.stringify(options.value);
            return this.redis
            .set(options.key, valueToStore, "EX", options.exp)
            .then(resolve)
            .catch(reject);
        });
    }

    getJSON(options = {}) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.key)) {
                return resolve(null);
            }
            return this.redis
            .get(options.key)
            .then(JSON.parse)
            .then(resolve)
            .catch(reject);
        });
    }

    delete(options = {}) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.key)) {
                return resolve(0);
            }
            return this.redis
            .del(key)
            .then(resolve)
            .catch(reject);
        });
    }

    exists(options = {}) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.key)) {
                return resolve(false);
            }
            return this.redis
            .exists(options.key)
            .then(result => resolve((result === 1)))
            .catch(reject);
        });
    }
};
