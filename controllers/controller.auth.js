const RedditController = require("./controller.reddit");
const Redis = require("../cache");
const snoowrap = require("snoowrap");

module.exports = class Auth extends RedditController {
    constructor(options) {
        super(options);
    }

    async getAuthUrl() {
    	let scopes = await this.snoo.getOauthScopeList();
    	let keys = this._.keys(scopes);
    	let options = {
    		clientId: 'TrXPd_2qf8vU4w',
  			scope: keys,
  			redirectUri: "snoogle://reddit/auth",
  			permanent: true
    	};
    	let url = snoowrap.getAuthUrl(options);
    	return { url: url };
    }
};