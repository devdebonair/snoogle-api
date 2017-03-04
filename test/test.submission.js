const Subreddit = require("../controllers").Subreddit;
const chai = require("chai");
const expect = chai.expect;
const devdebonair = require("../config.js").accounts.devdebonair;
const subreddit = new Subreddit(devdebonair);
const subredditTestName = "snoogle";

describe('Subreddit', () => {

    describe("Submit Link", () => {
        it("should submit text post", (done) => {
            const options = {
                title: "This is a post",
                text: "This is post content.",
                subreddit: subredditTestName
            };
            subreddit.submitText(options)
            .then(listing => {
                expect(listing).to.have.property("name");
                done();
            })
            .catch(done);
        });
    });


});
