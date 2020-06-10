const functions = require("firebase-functions");


const ejemploRequests = require("./api/ejemploRequests");

const usersRequests = require("./api/usersRequests");
const contactsRequests = require("./api/contactsRequests");


exports.ejemploRequests = functions.https.onRequest(ejemploRequests.requests);

exports.usersRequests = functions.https.onRequest(usersRequests.requests);
exports.contactsRequests = functions.https.onRequest(contactsRequests.requests);