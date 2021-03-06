const _ = require("lodash");
const RedditError = require("../helpers/RedditError");

module.exports = class Cache {
    constructor(redis) {
        this.redis = redis;
        
        this._operationType = { store: 0, get: 1, exists: 2 };
        this._dataStructureType = { list: 0, hmap: 1, direct: 2 };
        
        this._operation = null;
        this._dataStructure = null;

        this.items = null;
    }

    store() {
        this._operation = this._operationType.store;
        return this;
    }

    get() {
        this._operation = this._operationType.get;
        return this;
    }

    hmap() {
        this._dataStructure = this._dataStructureType.hmap;
        return this;
    }

    list() {
        this._dataStructure = this._dataStructureType.list;
        return this;
    }

    direct() {
        this._dataStructure = this._dataStructureType.direct;
        return this;
    }

    items(items) {
        this.items = items;
        return this;
    }

    exists() {
        this._operation = this._operationType.exists;
        return this;
    }

    exec() {
        return new Promise((resolve, reject) => {
            const error = this._checkArguments();
            if(!_.isEmpty(error)) { return reject(error); }

            if(this.operation === this._operationType.exists) {
                if(this._dataStructure === this._dataStructureType.hmap) {
                    return hmapExists(items).then(resolve).catch(reject);
                }

                if(this._dataStructure === this._dataStructureType.direct) {
                    return directExists(items).then(resolve).catch(reject);
                }
            }

            if(this._operation === this._operationType.store) {
                if(this._dataStructure === this._dataStructureType.hmap) {
                    if(_.isArray(this.items)) {
                        return storeManyJSONHash(items).then(resolve).catch(reject);
                    }
                    if(_.isPlainObject(this.items)) {
                        return storeJSONHash(items).then(resolve).catch(reject);
                    }
                }

                if(this._dataStructure === this._dataStructureType.direct) {
                    if(_.isArray(this.items)) {
                        return reject(new RedditError("Not implemented.", "Cannot store multiple cache items.", 500));
                    }
                    if(_.isPlainObject(this.items)) {
                        return storeJSON(items).then(resolve).catch(reject);
                    }
                }
            }

            if(this._operation === this._operationType.get) {
                if(this._dataStructure === this._dataStructureType.hmap) {
                    if(_.isArray(this.items)) {
                        return reject(new RedditError("Not implemented.", "Cannot fetch multiple cache items.", 500));
                    }
                    if(_.isPlainObject(this.items)) {
                        return getJSONHash(items).then(resolve).catch(reject);
                    }
                }
                if(this._dataStructureType === this._dataStructureType.direct) {
                    if(_.isArray(this.items)) {
                        return reject(new RedditError("Not implemented.", "Cannot fetch multiple cache items.", 500));
                    }
                    if(_.isPlainObject(this.items)) {
                        return getJSON(items).then(resolve).catch(reject);
                    }   
                }
            }
        });
    }

    _checkArguments() {
        if(_.isEmpty(this._operation)) {
            return new RedditError("Missing Arguments", "Must specify operation for caching", 500);
        }

        if(_.isEmpty(this._dataStructure)) {
            return new RedditError("Missing Arguments", "Must specify data structure for caching", 500);
        }

        if(_.isEmpty(this.items)) {
            return new RedditError("Missing Arguments", "Must provide items for caching.", 500);
        }

        return null;
    }

    // [{
    //     map: "[subreddit]:[sort]",
    //     key: "[after]",
    //     value: [Listing]
    // },
    // {
    //     map: "[subreddit]:[sort]",
    //     key: "[after]",
    //     value: [Listing]
    // },
    // {
    //     map: "[subreddit]:[sort]",
    //     key: "[after]",
    //     value: [Listing]
    // }]
    storeManyJSONHash(options = {}) {
        return new Promise((resolve, reject) => {
            let pipeline = this.redis.pipeline();
            for(let item of options.items) {
                const valueToStore = JSON.stringify(item.value);
                pipeline.hmset(options.map, item.key, valueToStore);
            }
            if(options.exp) {
                pipeline.expire(options.map, options.exp);
            }
            pipeline.exec()
            .then(resolve)
            .catch(reject);
        });
    }

    // {
    //     map: "[subreddit]:[sort]",
    //     key: "[after]",
    //     value: [Listing]
    // }
    async storeJSONHash(options = {}) {
        if(_.isEmpty(options.map) || _.isEmpty(options.key) || _.isEmpty(options.value)) {
            return resolve(null);
        }
        const valueToStore = JSON.stringify(options.value);
        try {
        	return await this.redis.hmset(options.map, options.key, valueToStore);
        } catch(e) {
        	throw e;
        }
    }

    // { map: "[subreddit]:[sort]", "key": "[after]" }
    async getJSONHash(options = {}) {
        if(_.isEmpty(options.map) || _.isEmpty(options.key)) {
            return resolve(null);
        }
        try {
            let result = await this.redis.hget(options.map, options.key);
            return JSON.parse(result);
        } catch(e) {
        	throw e;
        }
    }

    // { key: "[post].id", value: Submission}
    async storeJSON(options = {}) {
        if(_.isEmpty(options.key) || _.isEmpty(options.value)) {
            return resolve(null);
        }
        try {
            const valueToStore = JSON.stringify(options.value);
            if(options.exp) {
                return await this.redis.set(options.key, valueToStore, "EX", options.exp)
            }
            return await this.redis.set(options.key, valueToStore);
        } catch(e) {
            throw e;
        }
    }

    // { key: "[post].id" }
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
            .del(options.key)
            .then(resolve)
            .catch(reject);
        });
    }

    directExists(options = {}) {
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

    hmapExists(options = {}) {
        return new Promise((resolve, reject) => {
            if(_.isEmpty(options.map) || _.isEmpty(options.key)) {
                return resolve(false);
            }
            return this.redis
            .hexists(options.map, options.key)
            .then(result => resolve((result === 1)))
            .catch(reject);
        });
    }
};
