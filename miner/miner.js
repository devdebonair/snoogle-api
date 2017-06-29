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
        let parsedURL = URL.parse(url);
        let hostname = parsedURL.hostname;
        if(hostname.toLowerCase().includes("imgur")) {
            return this.services.imgur;
        }
        if(hostname.toLowerCase().includes("gfycat")) {
            return this.services.gfycat;
        }
        return null;
    }
};