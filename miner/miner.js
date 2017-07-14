const _ = require("lodash");
const URL = require("url");
const Imgur = require("../services/service.imgur");
const Gfycat = require("../services/service.gfycat");

module.exports = class Miner {
	constructor() {
        this.services = {};
        this.services.imgur = new Imgur();
        this.services.gfycat = new Gfycat();
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
        return null;
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