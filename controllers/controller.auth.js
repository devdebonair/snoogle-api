const RedditController = require("./controller.reddit");

module.exports = class Auth extends RedditController {
    constructor(options) {
        super(options);
    }

    async getAuthUrl() {
    	let scopes = await this.snoo.getOauthScopeList();
    	let keys = this._.keys(scopes);
    	let options = {
    		clientId: '82Lt0biR5aH4ng',
    		clientSecret: "",
  			scope: keys,
  			redirectUri: "snoogle://reddit/auth",
  			permanent: true
    	};
    	let url = this.snoowrap.getAuthUrl(options);
    	return { url: url };
    }

    async getTokens(options) {
    	let clientOptions = {
			clientId: this.account.clientId,
			clientSecret: '',
			userAgent: this.account.userAgent
		};
		let formOptions = {
			grant_type: 'authorization_code', 
			code: this.account.code, 
			redirect_uri: this.account.redirectUri
		};
		let response = await this.snoowrap.prototype.credentialedClientRequest.call(clientOptions, {
			method: 'post',
			baseUrl: 'https://www.reddit.com',
			uri: 'api/v1/access_token',
			form: formOptions
		});
		let accessToken = response.access_token;
		let refreshToken = response.refresh_token;
		let snooOptions = {
			clientId: this.account.clientId,
			userAgent: this.account.userAgent,
			accessToken: accessToken,
			refreshToken: refreshToken
		};
		let me = await new this.snoowrap(snooOptions).getMe();
		return this._.assign({name: me.name}, response);
    }
};