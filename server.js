const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

const REPORTS_COLLECTION = "reports";

const app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
const loca_db_uri = "mongodb://localhost:27017/test";

mongodb.MongoClient.connect(process.env.MONGODB_URI || loca_db_uri, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, () => {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// REPORTS API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get("/api/reports", (req, res) => {
    db.collection(REPORTS_COLLECTION).find({}).toArray((err, docs) => {
        if (err) {
            handleError(res, err.message, "Failed to get reports.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/reports", (req, res) => {
    var newReport = req.body;
    newReport.createDate = new Date().getTime();

    if (!req.body.title) {
        handleError(res, "Invalid user input", "Must provide a title.", 400);
    } else {
        db.collection(REPORTS_COLLECTION).insertOne(newReport, (err, doc) => {
            console.log(newReport);
            if (err) {
                handleError(res, err.message, "Failed to create new report.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

app.get("/api/reports/:id", (req, res) => {
    db.collection(REPORTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
        if (err) {
            handleError(res, err.message, "Failed to get report");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/api/reports/:id", (req, res) => {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(REPORTS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, {$set: updateDoc}, (err, doc) => {
        if (err) {
            console.log(updateDoc);
            handleError(res, err.message, "Failed to update report");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
});

app.delete("/api/reports/:id", (req, res) => {
    db.collection(REPORTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
        if (err) {
            handleError(res, err.message, "Failed to delete report");
        } else {
            res.status(200).json(req.params.id);
        }
    });
});
