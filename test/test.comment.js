let dotenv = require("dotenv").config({path: '../.env'});
if(dotenv.error) {
    console.log(dotenv.error);
    process.exit(1); 
}
const config = require("../config");
const account = config.test.reddit;
const testSubreddit = config.test.subreddit;

const Submission = require("../controllers").Submission;
const Subreddit = require("../controllers").Subreddit;
const Comment = require("../controllers").Comment;

const submission = new Submission(account);
const subreddit = new Subreddit(account);
const comment = new Comment(account);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();
let submissionId = "";
let parentCommentId = "";

let getOptions = () => {
    return {
        comment: { id: parentCommentId },
        before: {
            createSubmission: { subreddit: testSubreddit, title: "This is an example.", text: "This is a test" },
            replySubmission: { id: submissionId, text: "this is a reply" }
        },
        comments: {
            reply: { id: parentCommentId, text: "This is testing the submission reply." },
            get: { id: parentCommentId }
        },
        edit: { id: parentCommentId, text: "This text has been edited." }
    };
};

describe("Comments", () => {
    before(() => {
        return subreddit.submitText(getOptions().before.createSubmission).then(post => {
            submissionId = post.name;
            return submission.reply(getOptions().before.replySubmission).then(comment => {
                parentCommentId = comment.name;
            });
        });
    });

    describe("Fetch", () => {
        it("should fetch", () => {
            return comment.fetch(getOptions().comments.get)
            .should.eventually.have.property("name");
        });
    });

    describe("Reply", () => {
        it("should reply", () => {
            return comment.reply(getOptions().comments.reply)
            .should.eventually.have.property("name");
        });
    });


    describe("Votes", () => {
        it("should upvote", () => {
            return comment.upvote(getOptions().comment)
            .should.eventually.have.property("name");
        });

        it("should downvote", () => {
            return comment.downvote(getOptions().comment)
            .should.eventually.have.property("name");
        });

        it("should unvote", () => {
            return comment.unvote(getOptions().comment)
            .should.eventually.have.property("name");
        });
    });

    describe("Saves", () => {
        it("should save", () => {
            return comment.save(getOptions().comment)
            .should.eventually.have.property("name");
        });

        it("should unsave", () => {
            return comment.unsave(getOptions().comment)
            .should.eventually.have.property("name");
        });
    });

    describe("Edit", () => {
        it("should change text", () => {
            return comment.edit(getOptions().edit)
            .should.eventually.have.property("json");
        });
    });

    describe("Delete", () => {
        it("should delete", () => {
            return comment.delete(getOptions().comment)
            .should.eventually.have.property("success");
        });
    });

    after(() => {
        return submission.delete({ id: submissionId });
    });
});
