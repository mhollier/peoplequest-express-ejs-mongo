var mongodb = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectId;
var dbUrl = "mongodb://localhost:27017/peopleQuest";

function buildQuery(searchTerm) {

	if (searchTerm === undefined || searchTerm.length === 0)
		return {};

	var name = searchTerm.trim();
	return {
		$or: [
			{firstName: {$regex: name, $options: "i"}},
			{lastName: {$regex: name, $options: "i"}}
		]
	};
}
function calculatAge(dobString) {
	var dob = new Date(dobString);
	var now = new Date();
	var age = now.getFullYear() - dob.getFullYear();
	if ((dob.getMonth() > now.getMonth()) ||
		(dob.getMonth() == now.getMonth() && dob.getUTCDate() > now.getUTCDate())) {
		--age;
	}
	return age;
}

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
}

function createPersonArray(dbArray) {
	var people = [];
	for (var i = 0; i < dbArray.length; i++) {
		people.push(createPerson(dbArray[i]));
	}
	return people;
}

function getPerson(id, callback) {
	var objId = new objectId(id);
	mongodb.connect(dbUrl, function (err, db) {
		var collection = db.collection("people");
		collection.findOne({_id: objId}, function (err, results) {
			callback(err, {person: createPerson(results)});
			db.close();
		});
	});
}

function getPeople(searchTerm, page, pageSize, callback) {

	// Build the database query
	var query = buildQuery(searchTerm);

	// Get the current page number
	if (page === undefined || isNaN(page) || page < 1) {
		page = 1;
	}

	mongodb.connect(dbUrl, function (err, db) {
		var collection = db.collection("people");
		collection.find(query).count(function (err, count) {

			// Calculate the number to skip for paging
			var skipCount = pageSize * (page - 1);
			// Calculate the total number of pages (pageCount)
			var pageCount = Math.ceil(count / pageSize);

			// Query database and return results via callback
			collection.find(query).skip(skipCount).limit(pageSize).toArray(function (err, results) {
				callback(err, {
					people: createPersonArray(results),
					page: page,
					pageCount: pageCount
				});
				db.close();
			});
		});
	});
}

module.exports = {
	getPeople: getPeople,
	getPerson: getPerson
};
