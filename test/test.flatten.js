require("dotenv").config();
const flatten = require("../helpers/helper.flatten");
const chai = require("chai");
const should = chai.should();

var tree = {
    children: [{
        id: 1,
        title: "home",
        parent: null,
        children: []
    }, {
        id: 2,
        title: "about",
        parent: 17,
        children: [{
            id: 3,
            title: "team",
            parent: null,
            children: []
        }, {
            id: 4,
            title: "company",
            parent: null,
            children: []
        }]
    }]
};

let expectedOutput = [
    { id: 1, title: 'home', parent: undefined, level: 0 },
    { id: 2, title: 'about', parent: undefined, level: 0 },
    { id: 3, title: 'team', parent: 2, level: 1 },
    { id: 4, title: 'company', parent: 2, level: 1 }
];

describe("Flatten", () => {
    it("should flatten", (done) => {
        let list = flatten(tree, "id", "parent", "children", "level");
        list.should.eql(expectedOutput);
        done();
    });
});
