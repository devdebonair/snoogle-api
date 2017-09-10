let URL = require("url");

module.exports = class YoutubeDL {
	constructor() {
		this.youtube = require("youtube-dl");
	}

	async fetch(url) {
		try {
			let info = await this.getInfo(url);
			let parsedURL = URL.parse(url);
	        let hostname = parsedURL.hostname;
	        let domainURL = hostname;
	        let poster = info.thumbnail;
	        if(hostname.toLowerCase().includes("youtu.be") || hostname.toLowerCase().includes("youtube")) {
	        	domainURL = "youtube.com";
	        	if(poster.toLowerCase().includes("ytimg")) {
	        		poster = poster.replace("/default", "/maxresdefault");
	        	}
	        }

			return [{
	            type: "movie",
	            width: parseInt(info.width),
	            height: parseInt(info.height),
	            poster: info.thumbnail,
	            url: info.url,
	            description: info.description,
	            title: info.title,
	            author: info.uploader,
	            logo: `https://logo.clearbit.com/${domainURL}`
	        }];
		} catch(e) {
			throw e;
		}
	}

	getInfo(url) {
		let self = this;
		return new Promise((resolve, reject) => {
			self.youtube.getInfo([url], (error, info) => {
				if(error) { return reject(error); }
				return resolve(info);
			});
		});
	}
};