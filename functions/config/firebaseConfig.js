var admin = require('firebase-admin');

var serviceAccount = require("./credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agendavirtual-f818c.firebaseio.com"
});

admin.firestore().settings({ timestampsInSnapshots: true });


module.exports = admin;