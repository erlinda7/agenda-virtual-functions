const functions = require("firebase-functions");



const ejemploRequests = require("./api/ejemploRequests");


exports.ejemploRequests = functions.https.onRequest(ejemploRequests.requests);