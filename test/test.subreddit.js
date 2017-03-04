const Subreddit = require("../controllers").Subreddit;
const Submission = require("../controllers").Submission;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const devdebonair = require("../config.js").accounts.devdebonair;
const subreddit = new Subreddit(devdebonair);
const submission = new Submission(devdebonair);

chai.use(chaiAsPromised);

const should = chai.should();

const subredditTestName = "snoogle";
const options = {
    testSubreddit: { subreddit: subredditTestName },
    submit: {
        text: { title: "This is a post", text: "This is post content.", subreddit: subredditTestName },
        link: { title: "This is a post", url: "https://www.youtube.com/", subreddit: subredditTestName }
    },
    subscription: {
        subreddit: { subreddit: "rocketleague" }
    },
    listing: { subreddit: subredditTestName, after: null, sort: "hot" }
};

describe('Subreddit', () => {

    after(() => {
        return subreddit.getListing(options.testSubreddit)
        .then(listing => {
            return listing.data.map((submission) => {
                return submission.id;
            });
        })
        .then(submissionIds => {
            let promises = [];
            for(let id of submissionIds) {
                promises.push(submission.delete({id: id}));
            }
            return Promise.all(promises);
        });
    });

    describe("Submit", () => {
        it("should submit text post", () => {
            return subreddit.submitText(options.submit.text).should.eventually.have.property("name");
        });

        it("should submit link post.", () => {
            return subreddit.submitLink(options.submit.link).should.eventually.have.property("name");
        });
    });

    describe("Subscription", () => {
        it("should subscribe", () => {
            return subreddit.subscribe(options.subscription.subreddit).should.eventually.have.property("display_name");
        });

        it("should unsubscribe", () => {
            return subreddit.unsubscribe(options.subscription.subreddit).should.eventually.have.property("display_name");
        });
    });

    describe("Fetch", () => {
        it("should fetch subreddit information", () => {
            return subreddit.fetch(options.testSubreddit).should.eventually.have.property("id");
        });
    });

    describe("Listing", () => {
        it("should fetch listing", () => {
            return subreddit.getListing(options.listing).should.eventually.have.property("data");
        });
    });
});
