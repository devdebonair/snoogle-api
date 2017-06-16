const URL = require('url');
const imgur = require('imgur');
const _ = require("lodash");
const clientId = require("../config").imgur.clientId;
const mediaIdRegex = /[^\/]+(?=\/$|$)/g;
imgur.setClientId(clientId);


// module.exports = imgur;


module.exports = class Imgur {
	constuctor() {}

	fetch(url) {
		return new Promise((resolve, reject) => {
			let parsedURL = URL.parse(url);
			let hostname = parsedURL.hostname;
			let regex = /[^\/]+(?=\/$|$)/g;
			let mediaID = this.parseId(url);

			if(!hostname.toLowerCase().includes('imgur')){ 
				return resolve(new Error(`Invalid Imgur URL: ${url}`));
			}
	        
	        if(parsedURL.pathname.includes('/a/') || parsedURL.pathname.includes('/gallery/')){
	            return this.album(mediaID).then(resolve).catch(reject);
	        }

	        return this.image(mediaID).then(resolve).catch(reject);
		});
	}

	parseId(url) {
		let regex = /[^\/]+(?=\/$|$)/g;
		return url.match(regex)[0].replace(/\.[A-Za-z]+/g, "");
	}

	album(id) {
		let self = this;
		return new Promise((resolve, reject) => {
			imgur
			.getAlbumInfo(id)
			.then(media => {
				let images = [];
		        let imagesData = media.data.images;
		        let retval = [];
		        if(imagesData.length > 1) {
		            for(let image of imagesData){
		                if(self._isGif(image.type)) {
		                    images.push(self._extractVideo(image));
		                } else {
		                    images.push(self._extractImage(image));
		                }
		            }
		            retval = images;
		        } else if(imagesData.length === 1) {
		            if(self._isGif(imagesData[0].type)) {
		                images.push(self._extractVideo(imagesData[0]));
		            } else {
		                images.push(self._extractImage(imagesData[0]));
		            }
		        }
		        return resolve(retval);
			})
			.catch(reject);
		});
	}

	image(id) {
		let self = this;
		return new Promise((resolve, reject) => {
			imgur
			.getInfo(id)
			.then(media => {
		        let retval = [];
		        let data = media.data;
		        if(self._isGif(data.type)) {
		            retval = [self._extractVideo(data)];
		        } else {
		            retval = [self._extractImage(data)];
		        }
		        return resolve(retval);
		    })
		    .catch(reject);
		});
	}

	_isGif(contentType) {
		return contentType === "image/gif";
	}

	_extractVideo(data) {
		let pathRegex = /[^\/]+(?=\/$|$)/g;
	    let extensionRegex = /\.[A-Za-z]+/;
	    let extension = null;
	    let sizes = {};
	    let retval = {};
	    if(pathRegex.test(data.link)) {
	        extension = data.link.match(pathRegex)[0].match(extensionRegex)[0];
	    }
	    if(extension !== null){
	        let newLink = data.link.replace(extension, "");
	        let sizeIndicators = ['s','m','l'];
	        for(let indicator of sizeIndicators) {
	            switch (indicator) {
	                case "s":
	                    sizes.small = newLink + indicator + extension;
	                    break;
	                case "m":
	                    sizes.medium = newLink + indicator + extension;
	                    break;
	                case "l":
	                    sizes.large = newLink + indicator + extension;
	                    break;
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

	_extractImage(data) {
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