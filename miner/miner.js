const _ = require("lodash");
const URL = require("url");
const Imgur = require("../services/service.imgur");
const Gfycat = require("../services/service.gfycat");
const YoutubeDL = require("../services/service.youtubedl");

module.exports = class Miner {
	constructor() {
        this.services = {};
        this.services.imgur = new Imgur();
        this.services.gfycat = new Gfycat();
        this.services.youtubedl = new YoutubeDL();
	}

    async fetch(url) {
        try {
            let service = this.getService(url);
            if(service) {
                return await service.fetch(url);
            } else {
                return [];
            }
        } catch(e) {
            return [];
        }
    }

    getService(url) {
        if(this.isImgur(url)) {
            return this.services.imgur;
        }
        if(this.isGfycat(url)) {
            return this.services.gfycat;
        }
        return this.services.youtubedl;
    }

    isImgur(url) {
        let parsedURL = URL.parse(url);
        let hostname = parsedURL.hostname;
        return hostname.toLowerCase().includes("imgur");
    }

    isGfycat(url) {
        let parsedURL = URL.parse(url);
        let hostname = parsedURL.hostname;
        return hostname.toLowerCase().includes("gfycat");
    }
};