var mongodb = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectId;
var dbUrl = "mongodb://localhost:27017/peopleQuest";

function buildQuery(searchTerm) {

	if (searchTerm === undefined || searchTerm.length === 0)
		return {};

	var name = searchTerm.trim();
	return { $or: [
		{firstName: {$regex: name, $options: "i"}},
		{lastName: {$regex: name, $options: "i"}}
	]};
};

function getIndex(req, res) {
	var searchTerm = req.query["searchTerm"];
	console.log("getIndex: searchTerm=" + searchTerm);
	var query = buildQuery(searchTerm);

	mongodb.connect(dbUrl, function(err, db) {
		var collection = db.collection("people");
		if (req.xhr) {
			// Received via an AJAX request, so return partial view
			collection.find(query).toArray(function (err, results) {
				res.render("partials/peopleList", {people: results});
			});
		}
		else {
			// Render full view
			collection.find(query).toArray(function(err, results) {
				res.render("index", {people: results});
			});
		}
	});
};

function getById(req, res) {
	var id = new objectId(req.params.id);
	console.log("getById: " + id);
	mongodb.connect(dbUrl, function(err, db) {
		var collection = db.collection("people");
		collection.findOne({_id: id}, function(err, results) {
			//res.send(results);
			res.render("details", {person: results});
		});
	});
};

module.exports = {
	getIndex: getIndex, getById: getById
};

