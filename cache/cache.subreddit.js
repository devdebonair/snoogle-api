const Cache = require("./index");

// { subreddit, sort, after, listing, exp }
exports.storeListing = (options = {}) => {
	const objectToCache = {
		map: `${options.subreddit}:${options.sort}`,
		key: options.after,
		value: options.listing,
		exp: options.exp
	};

	return Cache.shared().hmap().store().items(objectToCache).exec();
};

// { subreddit, sort, exp, [Listing] }
exports.storeManyListings = (options = {}) => {
	let objectsToCache = {};
	objectsToCache.map = `${options.subreddit}:${options.sort}`;
	objectsToCache.exp = 60 * 12;

	const listings = options.listings.map((item, index, origin) => {
		const key = (index <= 0) ? "null" : origin[index-1].after; // use 'null' as key for the first item 
		return { key: key, value: item };
	});

	objectsToCache.items = listings;
	// return Cache.shared().hmap().store().items(objectsToCache).exec();
	return Cache.shared().storeManyJSONHash(objectsToCache);
};

// { subreddit, sort, after }
exports.getListing = (options = {}) => {
	const details = {
		map: `${options.subreddit}:${options.sort}`,
		key: (options.after || "null")
	};
	// return Cache.shared().hmap().get().items(details).exec();
	return Cache.shared().getJSONHash(details);
};