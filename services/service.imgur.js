const URL = require('url');
const imgur = require('imgur');
const _ = require("lodash");
const clientId = require("../config").imgur.clientId;
const mediaIdRegex = /[^\/]+(?=\/$|$)/g;
imgur.setClientId(clientId);


// module.exports = imgur;


module.exports = class Imgur {
	constuctor() {}

	async fetch(url) {
		let parsedURL = URL.parse(url);
		let hostname = parsedURL.hostname;
		let regex = /[^\/]+(?=\/$|$)/g;
		let mediaID = this.parseId(url);
		if(!hostname.toLowerCase().includes('imgur')){ 
			throw new Error(`Invalid Imgur URL: ${url}`);
		}
        if(parsedURL.pathname.includes('/a/') || parsedURL.pathname.includes('/gallery/')){
            return await this.album(mediaID);
        }
	    return this.image(mediaID);
	}

	parseId(url) {
		let regex = /[^\/]+(?=\/$|$)/g;
		return url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
	}

	async album(id) {
		try {
			let album = await imgur.getAlbumInfo(id);
			let images = [];
	        let imagesData = album.data.images;
	        let retval = [];

	        if(imagesData.length > 1) {
	            for(let image of imagesData){
	                if(this._isGif(image.type)) {
	                    images.push(this._extractVideo(image));
	                } else {
	                    images.push(this._extractImage(image));
	                }
	            }
	            retval = images;
	        } else if(imagesData.length === 1) {
	            if(this._isGif(imagesData[0].type)) {
	                images.push(this._extractVideo(imagesData[0]));
	            } else {
	                images.push(this._extractImage(imagesData[0]));
	            }
	        }
	        return retval;
		} catch(e) {
			throw e;
		}

	}

	async image(id) {
		try {
			let image = await imgur.getInfo(id);
	        let retval = [];
	        let data = image.data;
	        if(this._isGif(data.type)) {
	            retval = [this._extractVideo(data)];
	        } else {
	            retval = [this._extractImage(data)];
	        }
	        return retval;
		} catch(e) {
			throw e;
		}
	}

	_isGif(contentType) {
		return contentType === "image/gif";
	}

	_extractImage(data) {
		let pathRegex = /[^\/]+(?=\/$|$)/g;
	    let extensionRegex = /\.[A-Za-z]+/;
	    let extension = null;
	    let sizes = {
	    	small: null,
	    	medium: null,
	    	large: null,
	    	huge: null
	    };
	    let retval = {};
	    if(pathRegex.test(data.link)) {
	        extension = data.link.match(pathRegex)[0].match(extensionRegex)[0];
	    }
	    if(extension !== null){
	        let newLink = data.link.replace(extension, "");
	        let sizeIndicators = ['s','m','l','h'];
	        for(let indicator of sizeIndicators) {
	            switch (indicator) {
	                case "s":
	                    sizes.small = `${newLink}${indicator}${extension}`;
	                    break;
	                case "m":
	                    sizes.medium = `${newLink}${indicator}${extension}`;
	                    break;
	                case "l":
	                    sizes.large = `${newLink}${indicator}${extension}`;
	                    break;
	                case "h":
	                	sizes.huge = `${newLink}${indicator}${extension}`;
	                default:
	                    break;
	            }
	        }
	    }

	    retval.type = "photo";
	    retval.width = data.width;
	    retval.height = data.height;
	    retval.url = data.link;
	    retval.description = data.description;
	    retval.sizes = _.isEmpty(sizes) ? null : sizes;
	    return retval;
	}

	_extractVideo(data) {
		let pathRegex = /[^\/]+(?=\/$|$)/g;
		let extensionRegex = /\.[A-Za-z]+/;
		let extension = null;
		if(pathRegex.test(data.link)) {
		    extension = data.link.match(pathRegex)[0].match(extensionRegex)[0];
		}
		return {
		    type: "video",
		    width: data.width,
		    height: data.height,
		    poster: null,
		    gif: `${data.link.replace(extension, "")}.gif`,
		    url: data.mp4,
		    description: data.description
		};
	}
}