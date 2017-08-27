module.exports = class YoutubeDL {
	constructor() {
		this.youtube = require("youtube-dl");
	}

	async fetch(url) {
		try {
			let info = await this.getInfo(url);
			return {
	            type: "movie",
	            width: parseInt(info.width),
	            height: parseInt(info.height),
	            poster: info.thumbnail,
	            url: info.url,
	            description: info.description,
	            title: info.title
	        };
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