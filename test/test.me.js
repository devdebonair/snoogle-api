let dotenv = require("dotenv").config({path: '../.env'});
if(dotenv.error) {
    console.log(dotenv.error);
    process.exit(1); 
}
const account = require("../config").test.reddit;
const Me = require("../controllers").Me;

const me = new Me(account);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();

let getOptions = () => {
    let targetUser = { name: "reddit" };
    return { targetUser: targetUser };
};

describe("Me", () => {
    describe("Fetch", () => {
        it("should fetch", () => {
            return me.fetch()
            .should.eventually.have.property("name");
        });
    });

    describe("Multireddits", () => {
        it("should fetch", () => {
            return me.getMultireddits()
            .should.eventually.be.an("Array");
        });
    });

    describe("Subscriptions", () => {
        it("should fetch", () => {
            return me.getSubscriptions()
            .should.eventually.be.an("Array");
        });
    });

    describe("Trophies", () => {
        it("should fetch", () => {
            return me.getTrophies()
            .should.eventually.have.property("trophies");
        });
    });

    describe("Friends", () => {
        it("should fetch", () => {
            return me.getFriends()
            .should.eventually.be.an("Array");
        });
    });

    describe("Blocked", () => {
        it("should fetch", () => {
            return me.getBlocked()
            .should.eventually.be.an("Array");
        });
    });

    describe("Inbox", () => {
        it("should fetch", () => {
            return me.getInbox()
            .should.eventually.be.an("Array");
        });

        it("should fetch unread", () => {
            return me.getUnreadInbox()
            .should.eventually.be.an("Array");
        });

        it("should fetch private messages", () => {
            return me.getPrivateMessages()
            .should.eventually.be.an("Array");
        });

        it("should fetch comment replies", () => {
            return me.getCommentReplies()
            .should.eventually.be.an("Array");
        });

        it("should fetch submission replies", () => {
            return me.getSubmissionReplies()
            .should.eventually.be.an("Array");
        });

        it("should fetch mentions", () => {
            return me.getMentions()
            .should.eventually.be.an("Array");
        });

        it("should fetch sent messages", () => {
            return me.getSentMessages()
            .should.eventually.be.an("Array");
        });
    });
});
