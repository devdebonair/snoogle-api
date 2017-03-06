const account = require("../config").accounts.test;
const PrivateMessage = require("../controllers").PrivateMessage;
const Me = require("../controllers").Me;

const pm = new PrivateMessage(account);
const me = new Me(account);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();

let getOptions = () => {
    return {
        compose: { to: account.username, subject: "Test", text: "This is a test."},
        reply: { id: "", text: "Testing replying feature." }
    };
};

describe("Comments", () => {

    before(() => {
        return Promise.all([
            pm.compose(getOptions().compose),
            pm.compose(getOptions().compose),
            pm.compose(getOptions().compose)
        ]);
    });

    describe("Fetch", () => {
        it("should fetch", () => {
            return me.getPrivateMessages().then(messages => {
                return pm.fetch({id: messages[0].id});
            })
            .should.eventually.have.property("name");
        });
    });

    describe("Compose", () => {
        it("should compose", () => {
            return pm.compose(getOptions().compose)
            .should.eventually.have.property("success");
        });
    });

    describe("Reply", () => {
        it("should reply", () => {
            return me.getPrivateMessages().then(messages => {
                let options = getOptions().reply;
                options.id = messages[0].id;
                return pm.reply(options);
            })
            .should.eventually.have.property("name");
        });
    });

    describe("Delete", () => {
        it("should delete", () => {
            return me.getPrivateMessages().then(messages => {
                return pm.delete({id: messages[0].id});
            })
            .should.eventually.have.property("success");
        });
    });

    after(() => {
        return me.getPrivateMessages()
        .then(messages => {
            return messages.map((message) => {
                return message.id;
            });
        })
        .then(messageIds => {
            let promises = [];
            for(let id of messageIds) {
                promises.push(pm.delete({id: id}));
            }
            return Promise.all(promises);
        });
    });
});
