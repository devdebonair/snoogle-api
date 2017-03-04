const devdebonair = require("../config").accounts.devdebonair;
const Submission = require("../controllers").Submission;
const Subreddit = require("../controllers").Subreddit;

const submission = new Submission(devdebonair);
const subreddit = new Subreddit(devdebonair);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const subredditTestName = "snoogle";
const should = chai.should();
let submissionId = "";


let getOptions = () => {
    return {
        after: { id: subredditTestName },
        before: { subreddit: subredditTestName, title: "This is an example.", text: "This is a test" },
        comments: {
            reply: { id: submissionId, text: "This is testing the submission reply." },
            get: { id: submissionId }
        }
    };
};

describe("Submissions", () => {
    before(() => {
        return subreddit.submitText(getOptions().before).then(submission => {
            submissionId = submission.name;
        });
    });

    describe("Comments", () => {
        it("should reply", () => {
            return submission.reply(getOptions().comments.reply).should.eventually.have.property("name");
        });

        it("should fetch", () => {
            return submission.getComments(getOptions().comments.get).should.eventually.have.length.above(0);
        });
    });

    after(() => {
        return subreddit.getListing(getOptions().after)
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
});
