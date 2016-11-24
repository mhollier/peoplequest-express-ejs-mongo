var mongodb = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectId;
var dbUrl = "mongodb://localhost:27017/peopleQuest";
var resultsPerPage = 5;

function buildQuery(searchTerm) {

	if (searchTerm === undefined || searchTerm.length === 0)
		return {};

	var name = searchTerm.trim();
	return { $or: [
		{firstName: {$regex: name, $options: "i"}},
		{lastName: {$regex: name, $options: "i"}}
	]};
};

function calculatAge(dobString) {
	var dob = new Date(dobString);
	var now = new Date();
	var age = now.getFullYear() - dob.getFullYear();
	if ((dob.getMonth() > now.getMonth()) ||
		(dob.getMonth() == now.getMonth() && dob.getUTCDate() >  now.getUTCDate())) {
		--age;
	}
	return age;
};

function createPerson(dbObj) {
	return {
		_id: dbObj._id,
		firstName: dbObj.firstName,
		lastName: dbObj.lastName,
		address1: dbObj.address1,
		address2: dbObj.address2,
		birthDate: dbObj.birthDate,
		interests: dbObj.interests,
		image: dbObj.image,
		age: calculatAge(dbObj.birthDate.slice(0, 10)),
		fullName: dbObj.firstName + " " + dbObj.lastName
	};
};

function createPersonArray(dbArray) {
	var people = [];
	for (var i = 0; i < dbArray.length; i++) {
		people.push(createPerson(dbArray[i]));
	}
	return people;
};

function getPerson(id, callback) {
	var objId = new objectId(id);
	mongodb.connect(dbUrl, function(err, db) {
		var collection = db.collection("people");
		collection.findOne({_id: objId}, function(err, results) {
			callback(err, {person: createPerson(results)});
		});
	});
};

function getIndex(req, res) {

	var query = buildQuery(req.query["searchTerm"]);

	// Get the current page number
	var page = parseInt(req.query["page"]);
	if (isNaN(page) || page < 1) {
		page = 1;
	}

	// Calculate the number to skip for paging
	var skipCount =  resultsPerPage * (page - 1);

	mongodb.connect(dbUrl, function(err, db) {
		var collection = db.collection("people");
		collection.find(query).count(function (err, count) {
			console.log("count=" + count);

			// Calculate the total number of pages (pageCount)
			var pageCount = Math.ceil(count / resultsPerPage);

			console.log("skipCount=" + skipCount + ", page=" + page +", pageCount=" + pageCount);

			// If received via an AJAX request, then use a partial view
			var view = (req.xhr) ? "partials/peopleList" : "index";

			// Render view
			collection.find(query).skip(skipCount).limit(resultsPerPage).toArray(function(err, results) {
				res.render(view, {people: createPersonArray(results), pageCount: pageCount, page: page});
			});
		});
	});
};

function getById(req, res) {
	var id = req.params.id;
	console.log("getById: " + id);
	getPerson(id, function (err, person) {
		res.render("details", person);
	});
};

function getEditById(req, res) {
	var id = req.params.id;
	console.log("getEditById: " + id);
	getPerson(id, function (err, person) {
		res.render("edit", person);
	});
};

function getDeleteById(req, res) {
	var id = req.params.id;
	console.log("getDeleteById: " + id);
	getPerson(id, function (err, person) {
		res.render("delete", person);
	});
};

module.exports = {
	getIndex: getIndex,
	getById: getById,
	getEditById: getEditById,
	getDeleteById: getDeleteById
};

