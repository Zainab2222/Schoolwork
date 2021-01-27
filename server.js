const express = require('express')

const app = express()
app.use(express.json());
const ObjectId = require("mongodb").ObjectId;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/lessons",function(req,res){
  const lesson = []


// connect to MongoDB
const MongoClient = require("mongodb").MongoClient;

let db;
MongoClient.connect("mongodb+srv://Mine:Zarah2016@cluster0.y1fow.mongodb.net/schoolwork?retryWrites=true&w=majority",
(err, client) => {
db = client.db("schoolwork")
})

// get the collection name
app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  // console.log('collection name:', req.collection)
  return next();
});

// display a message for root path to show that API is working
app.get("/", function (req, res) {
  res.send("You've gotten to your root path successfully \n Select a collection, e.g., /collection/messages");
});

// retrieve all the objects from an collection
app.get("/collection/:collectionName", (req, res) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});


//add an object
app.post("/collection/:collectionName", (req, res, next) => {
  req.collection.insert(req.body, (err, results) => {
    if (err) return next(err);
    res.send(results.ops);
  });
});

// update an object by ID
app.put("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.update(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send(result.result.n === 1 ? { msg: "success" } : { msg: "error" });
    }
  );
});

   // Static file middleware
    var path = require("path");
    var fs = require("fs");

    app.use(function(req, res, next) {
    // Uses path.join to find the path where the file should be
    var images = path.join(__dirname, 
    "images"
    , req.url);
    // Built-in fs.stat gets info about a file
    fs.stat(images, function(err, fileInfo) {
    if (err) {
    next();
    return;
    }
    if (fileInfo.isFile()) res.sendFile(images);
    else next();
    });
    });

    app.use(function(req, res) {
      // Sets the status code to 404
      res.status(404);
      // Sends the error "File does not exist!”
      res.send("File does not exist!");
      });

const port = process.env.PORT || 4000;

app.listen(port);
console.log("Running on 3k" & port);
