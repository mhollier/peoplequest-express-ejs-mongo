var express = require("express");
var mongodb = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectId;

var controller = require("./src/controllers/peopleController");

var dbUrl = "mongodb://localhost:27017/peopleQuest";

var app = express();

// Reference the public directory for static files (JavaScript, CSS, etc.)
app.use(express.static("public"));
app.set("views", "src/views");
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 5000);

// GET /
app.get("/", function(req, res) {
	res.redirect("/people");
});

// GET /people?searchTerm=stark
app.get("/people", function(req, res) {
	controller.getIndex(req, res);
	// var searchTerm = req.query["searchTerm"];
	// mongodb.connect(dbUrl, function(err, db) {
	// 	var collection = db.collection("people");
	// 	var mongoQuery = { $or: [
	// 		{firstName: {$regex: searchTerm, $options: "i"}},
	// 		{lastName: {$regex: searchTerm, $options: "i"}}
	// 	]};
	// 	if (req.xhr) {
	// 		collection.find(mongoQuery).toArray(function (err, results) {
	// 			res.render("partials/peopleList", {
	// 				people: results
	// 			});
	// 		});
	// 	}
	// 	else {
	// 		collection.find({}).toArray(function(err, results) {
	// 			if (searchTerm !== undefined || searchTerm.length === 0) {
	// 				res.render("index", {
	// 					people: results
	// 				});
	// 			}
	// 			else {
	// 				res.render("index", {
	// 					people: results
	// 				});
	// 			}
	// 		});
	// 	}
	// });
});

// GET /people/58309fd12389a81864566af3
app.get("/people/:id", function (req, res) {
	controller.getById(req, res);
});

// GET /contact
app.get("/contact", function(req, res) {
	res.render("contact");
});

app.listen(app.get("port"), function(err) {
	console.log("Server running on port " + app.get("port"));
});
