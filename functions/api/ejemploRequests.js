const express = require("express");

const admin = require("../config/firebaseConfig");
//const db = admin.firestore();
const app = express();

//const bookingsRef = db.collection("bookings");





app.get("/saludo", async (req, res) => {
  res.send("Hello from Firebase!");
});

exports.requests = app;