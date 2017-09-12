const Miner = require("../miner");
const Cache = require("../cache");
const _ = require("lodash");

module.exports = class MediaController {
    constructor() {}
    
    async fetch(options = { url: "" }) {
    	try {
    		let mapKey = "expiry-media";
    		let cacheKey = options.url;
    		let cachedMedia = await Cache.shared().getJSON({key: `${mapKey}:${cacheKey}`});
    		if(!_.isEmpty(cachedMedia)) {
    			return cachedMedia;
    		}
    		let miner = new Miner();
    		let media = await miner.fetch(options.url);
		    let cacheOptions = {
		        key: `${mapKey}:${cacheKey}`,
		        value: media,
		        exp: 60*60*6
		    };
		    Cache.shared().storeJSON(cacheOptions).then().catch(error => {
		        console.log(error);
		    });
		    return media;
    	} catch(e) {
    		console.log(e);
    		throw e;
    	}
    }
};
