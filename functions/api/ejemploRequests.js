const express = require("express");

const admin = require("../config/firebaseConfig");
const db = admin.firestore();

const app = express();

const usersRef = db.collection("users");



app.get("/saludo", async (req, res) => {
  res.send("Hello from Firebase!");
});


app.get("/users", async (req, res) => {
  usersRef.get()
    .then(docs => {
      const users = [];

      docs.forEach(doc => users.push({
        id: doc.id,
        name: doc.data().name,
        telephone: doc.data().telephone,
        email: doc.data().email,
        photo: doc.data().photo,
        uid: doc.data().uid,
      }));

      return res.json({ users: users });
    })
    .catch(err => {
      return res.json({ error: err });
    })
});

exports.requests = app;