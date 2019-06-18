var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var REPORTS_COLLECTION = "reports";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// REPORTS API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
  /*  "/api/reports"
   *    GET: finds all reports
   *    POST: creates a new report
   */
  
  app.get("/api/reports", function(req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get contacts.");
        } else {
          res.status(200).json(docs);
        }
    });
  });
  
  app.post("/api/reports", function(req, res) {
  
    });
  
  /*  "/api/reports/:id"
   *    GET: find report by id
   *    PUT: update report by id
   *    DELETE: deletes report by id
   */
  
  app.get("/api/reports/:id", function(req, res) {
  });
  
  app.put("/api/reports/:id", function(req, res) {
  });
  
  app.delete("/api/reports/:id", function(req, res) {
  });
