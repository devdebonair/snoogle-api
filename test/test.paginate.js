let dotenv = require("dotenv").config({path: '../.env'});
if(dotenv.error) {
    console.log(dotenv.error);
    process.exit(1); 
}
const paginate = require("../helpers/helper.array").paginate;
const chai = require("chai");
const should = chai.should();

const items = [1,2,3,4,5,6,7,8,9,10];
const itemsToMatch = [
	[1,2],
	[3,4],
	[5,6],
	[7,8],
	[9,10]
];

const options = {items: items, pageSize: 2};

describe("Paginate", () => {
	it("should create pages", (done) => {
		let paginatedItems = paginate(options);
		paginatedItems.should.eql(itemsToMatch);
		done();
	});
});