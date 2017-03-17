require("dotenv").config();
const config = require("../config");
const account = config.test.reddit;
const testSubreddit = config.test.subreddit;

const Submission = require("../controllers").Submission;
const Subreddit = require("../controllers").Subreddit;

const submission = new Submission(account);
const subreddit = new Subreddit(account);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();
let submissionId = "";


let getOptions = () => {
    return {
        submission: { id: submissionId },
        after: { id: testSubreddit },
        before: { subreddit: testSubreddit, title: "This is an example.", text: "This is a test" },
        comments: {
            reply: { id: submissionId, text: "This is testing the submission reply." },
            get: { id: submissionId }
        },
        edit: { id: submissionId, text: "This text has been edited." }
    };
};

describe("Submissions", () => {
    before(() => {
        return subreddit.submitText(getOptions().before)
        .then(submission => {
            submissionId = submission.name;
        });
    });

    describe("Fetch", () => {
        it("should fetch", () => {
            return submission.fetch(getOptions().submission)
            .should.eventually.have.property("name");
        });
    });

    describe("Comments", () => {
        it("should reply", () => {
            return submission.reply(getOptions().comments.reply)
            .should.eventually.have.property("name");
        });

        it("should fetch", () => {
            return submission.getComments(getOptions().comments.get)
            .should.eventually.be.an("Array");
        });
    });

    describe("Votes", () => {
        it("should upvote", () => {
            return submission.upvote(getOptions().submission)
            .should.eventually.have.property("name");
        });

        it("should downvote", () => {
            return submission.downvote(getOptions().submission)
            .should.eventually.have.property("name");
        });

        it("should unvote", () => {
            return submission.unvote(getOptions().submission)
            .should.eventually.have.property("name");
        });
    });

    describe("Saves", () => {
        it("should save", () => {
            return submission.save(getOptions().submission)
            .should.eventually.have.property("name");
        });

        it("should unsave", () => {
            return submission.unsave(getOptions().submission)
            .should.eventually.have.property("name");
        });
    });

    describe("Visibility", () => {
        it("should hide", () => {
            return submission.hide(getOptions().submission)
            .should.eventually.have.property("name");
        });

        it("should unhide", () => {
            return submission.unhide(getOptions().submission)
            .should.eventually.have.property("name");
        });
    });

    describe("Edit", () => {
        it("should change text", () => {
            return submission.edit(getOptions().edit)
            .should.eventually.have.property("json");
        });
    });

    describe("Delete", () => {
        it("should delete", () => {
            return submission.delete(getOptions().submission)
            .should.eventually.have.property("name");
        });
    });
});
