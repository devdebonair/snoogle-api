module.exports = {
    reddit: {
        userAgent: process.env.REDDIT_USER_AGENT,
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
    },
    imgur: {
        clientId: process.env.IMGUR_CLIENT_ID,
    },
    gfycat: {
        clientId: process.env.GFYCAT_CLIENT_ID,
        clientSecret: process.env.GFYCAT_CLIENT_SECRET
    },
    test: {
        subreddit: process.env.DEV_TEST_SUBREDDIT
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        family: process.env.REDIS_FAMILY,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB
    }
};
