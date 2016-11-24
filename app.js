/**
 * app.js
 *
 * The main web application entry point.
 *
 */
var express = require("express");
var controller = require("./src/controllers/peopleController");

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

// GET /people?searchTerm=stark&page=2
app.get("/people", function(req, res) {
	controller.getIndex(req, res);
});

// GET /people/58309fd12389a81864566af3
app.get("/people/:id", function (req, res) {
	controller.getById(req, res);
});

app.listen(app.get("port"), function(err) {
	console.log("Server running on port " + app.get("port"));
});
