const devdebonair = require("../config").accounts.devdebonair;
const User = require("../controllers").User;

const user = new User(devdebonair);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();


let getOptions = () => {
    let targetUser = { name: "reddit" };
    return {
        targetUser: targetUser
    };
};

describe("Users", () => {

    // before(_ => {
    //     // return user.addFriend(getOptions().targetUser).then();
    // });

    describe("Friends", () => {
        it("should add", () => {
            return user.addFriend(getOptions().targetUser).should.eventually.have.property("name");
        });

        it("should remove", () => {
            return user.removeFriend(getOptions().targetUser).should.eventually.have.property("success");
        });
    });

    describe("Fetch", () => {
        it("should fetch", () => {
            return user.fetch(getOptions().targetUser).should.eventually.have.property("name");
        });
    });

    describe("Trophies", () => {
        it("should fetch", () => {
            return user.getTrophies(getOptions().targetUser).should.eventually.have.property("trophies");
        });
    });

    describe("Submissions", () => {
        it("should fetch", () => {
            return user.getSubmissions(getOptions().targetUser).should.eventually.have.property("data");
        });
    });

    describe("Comments", () => {
        it("should fetch", () => {
            return user.getComments(getOptions().targetUser).should.eventually.be.an("Array");
        });
    });

    describe("Multireddits", () => {
        it("should fetch", () => {
            return user.getMultireddits(getOptions().multireddits).should.eventually.be.an("Array");
        });
    });

    describe("Subscriptions", () => {
        it("should fetch", () => {
            return user.getSubscriptions(getOptions().subscriptions).should.eventually.be.an("Array");
        });
    });

    describe("Inbox", () => {
        it("should fetch unread", () => {
            return user.getNotifications().should.eventually.be.an("Array");
        });

        it("should fetch private messages", () => {
            return user.getPrivateMessages().should.eventually.be.an("Array");
        });

        it("should fetch comment replies", () => {
            return user.getCommentReplies().should.eventually.be.an("Array");
        });

        it("should fetch submission replies", () => {
            return user.getSubmissionReplies().should.eventually.be.an("Array");
        });

        it("should fetch mentions", () => {
            return user.getMentions().should.eventually.be.an("Array");
        });

        it("should fetch sent messages", () => {
            return user.getSentMessages().should.eventually.be.an("Array");
        });
    });
});
