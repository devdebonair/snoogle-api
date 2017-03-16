const account = require("../config").reddit;
const User = require("../controllers").User;

const user = new User(account);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();

let getOptions = () => {
    let targetUser = { name: "reddit" };
    return { targetUser: targetUser };
};

describe("Users", () => {

    describe("Friends", () => {
        it("should add", () => {
            return user.addFriend(getOptions().targetUser)
            .should.eventually.have.property("name");
        });

        it("should remove", () => {
            return user.removeFriend(getOptions().targetUser)
            .should.eventually.have.property("success");
        });
    });

    describe("Fetch", () => {
        it("should fetch", () => {
            return user.fetch(getOptions().targetUser)
            .should.eventually.have.property("name");
        });
    });

    describe("Trophies", () => {
        it("should fetch", () => {
            return user.getTrophies(getOptions().targetUser)
            .should.eventually.have.property("trophies");
        });
    });

    describe("Submissions", () => {
        it("should fetch", () => {
            return user.getSubmissions(getOptions().targetUser)
            .should.eventually.have.property("data");
        });
    });

    describe("Comments", () => {
        it("should fetch", () => {
            return user.getComments(getOptions().targetUser)
            .should.eventually.be.an("Array");
        });
    });
});
