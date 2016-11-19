var express = require("express");
var mongodb = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectId;

var port = process.env.PORT || 5000;
var dbUrl = "mongodb://localhost:27017/peopleQuest";

var app = express();

// Reference the public directory for static files (JavaScript, CSS, etc.)
app.use(express.static("public"));
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    //res.send("Hello, World!");
    //res.render("index");
    mongodb.connect(dbUrl, function(err, db) {
        var collection = db.collection("people");
        collection.find({}).toArray(function(err, results) {
            //res.send(results);
            res.render("index", {people: results});
        });
        db.close();
    });
});

app.listen(port, function(err) {
    console.log("Server running on port " + port);    
});
