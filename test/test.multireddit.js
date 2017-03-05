const config = require("../config");
const account = config.accounts.test;
const testSubreddit = config.test.subreddit;

const Multireddit = require("../controllers").Multireddit;
const User = require("../controllers").User;

const multireddit = new Multireddit(account);
const user = new User(account);

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const should = chai.should();

let getOptions = () => {
    let multiToRemoveSub = { name: "multi_to_remove_subs", description: "This is an before test.", subreddits: [testSubreddit] };
    let multiToAddSub = { name: "multi_to_add_subs", description: "This is an before test.", subreddits: [testSubreddit] };
    let multiToDelete = { name: "multi_to_delete", description: "This is an before test.", subreddits: [testSubreddit] };
    let multiToEdit = { name: "multi_to_edit", description: "This is an before test.", subreddits: [testSubreddit] };
    return {
        delete: { name: multiToDelete.name },
        add: { name: multiToAddSub.name, subreddit: "rocketleague" },
        remove: { name: multiToRemoveSub.name, subreddit: "iosprogramming" },
        copy: { user: "reddit", user_multiname: "redditnews", new_multiname: "news" },
        create: { name: "test", description: "This is a test.", subreddits: [testSubreddit] },
        before: {
            remove: multiToRemoveSub,
            add: multiToAddSub,
            delete: multiToDelete,
            edit: multiToEdit
        },
        edit: {
            name: multiToEdit.name,
            edits: {
                title: "Testing Multi",
                name: "Test Multi",
                description: "The ultimate change."
            }
        }
    };
};

describe("Multireddits", () => {

    before(() => {
        return Promise.all([
            multireddit.create(getOptions().before.remove),
            multireddit.create(getOptions().before.add),
            multireddit.create(getOptions().before.delete),
            multireddit.create(getOptions().before.edit)
        ]);
    });

    describe("Create", () => {
        it("should create", () => {
            return multireddit.create(getOptions().create)
            .should.eventually.have.property("name");
        });
    });

    describe("Copy", () => {
        it("should copy", () => {
            return multireddit.copy(getOptions().copy)
            .should.eventually.have.property("name");
        });
    });

    describe("Delete", () => {
        it("should delete", () => {
            return multireddit.delete(getOptions().delete)
            .should.eventually.have.property("success");
        });
    });

    describe("Edit", () => {
        it("should edit", () => {
            return multireddit.edit(getOptions().edit)
            .should.eventually.be.an("Array");
        });
    });

    describe("Subreddits", () => {
        it("should add", () => {
            return multireddit.addSubreddit(getOptions().add)
            .should.eventually.have.property("name");
        });

        it("should remove", () => {
            return multireddit.removeSubreddit(getOptions().remove)
            .should.eventually.have.property("name");
        });
    });

    after(() => {
        return user.getMultireddits()
        .then(multireddits => {
            return multireddits.map((multi) => {
                return multi.name;
            });
        })
        .then(multiNames => {
            let promises = [];
            for(let name of multiNames) {
                promises.push(multireddit.delete({name: name}));
            }
            return Promise.all(promises);
        });
    });
});
