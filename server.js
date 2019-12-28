const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const Assert = require("assert");
const app = express();

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

const mongo_url = "mongodb://localhost:27017";
const dataBase = "contact-user";

MongoClient.connect(mongo_url, (err, client) => {
  Assert.equal(err, null, "data base connxion failed");
  const db = client.db(dataBase);

            app.all("*", function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                next();
            });

  app.post("/new_contact", (req, res) => {
    let newcontact = req.body;
    db.collection("contacts").insertOne(newcontact, (err, data) => {
      if (err) res.send("cant add contact");
      else res.send(data);
    });
  });

  app.get("/", (req, res) => {
    db.collection("contacts")
      .find()
      .toArray((err, data) => {
        if (err) res.send("cant fetch contacts");
        else res.send(data);
      });
  });

  app.get("/contact/:id", (req, res) => {
    let searchedProductID = ObjectID(req.params.id);
    db.collection("contacts").findOne(
      { _id: searchedProductID },
      (err, data) => {
        if (err) res.send("cant fetch contacts");
        else res.send(data);
      }
    );
  });
  app.put("/modify_contact/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    let modifiedcontact = req.body;
    db.collection("contacts").findOneAndUpdate(
      { _id: id },
      { $set: { ...modifiedcontact } },
      (err, data) => {
        if (err) res.send("cant modify contacts");
        else res.send("c bn");
      }
    );
  });

  app.delete("/delete_contact/:id", (req, res) => {
    let contactToRemoveId = ObjectID(req.params.id);
    db.collection("contacts").findOneAndDelete(
      { _id: contactToRemoveId },
      (err, data) => {
        if (err) res.send("cant delete contact");
        else res.send("c bn");
      }
    );
  });
});

app.listen(5000, err => {
  if (err) console.log("server err");
  else console.log("server is runing on port 5000");
});
