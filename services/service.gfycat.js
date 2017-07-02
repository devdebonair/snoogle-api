// For use when the api gets more documentation
// const Gfycat = require('gfycat-sdk');
// const options = require("../config").gfycat;
//
// module.exports = new Gfycat({
//     clientId: gfycat.clientId,
//     clientSecret: gfycat.clientSecret
// });

const request = require('request-promise');
request.defaults({
    pool: { maxSockets: 100000 }
});

module.exports = class Gfycat {
	constructor() {}

	parseId(url) {
		let regex = /[^\/]+(?=\/$|$)/g;
		return url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
	}

	async fetch(url) {
		let options = {
            uri: `https://gfycat.com/cajax/get/${this.parseId(url)}`,
            json: true,
            forever: true,
            headers: { "user-agent": "nodev7.2.1:jiNIOlneh6TvXQ:1.0 (by /u/devdebonair)" }
        }
        try {
        	let media = await request(options);
        	let gfyItem = media.gfyItem;
        	return [this._extractVideo(gfyItem)];
        } catch(e) {
        	throw e;
        }
	}

	 _extractVideo(data) {
        return {
            type: "video",
            width: parseInt(data.width),
            height: parseInt(data.height),
            poster: data.mobilePosterUrl,
            gif: data.max2mbGif,
            url: data.mobileUrl,
            description: null
        };
    }
}