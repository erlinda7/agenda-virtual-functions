var admin = require('firebase-admin');

var serviceAccount = require("./credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agendavirtual-f818c.firebaseio.com"
});

admin.firestore().settings({ timestampsInSnapshots: true });


 module.exports = admin;

// const runtimeOpts = {
//     timeoutSeconds: 300,
//     memory: '1GB'
// }

// exports.myStorageFunction = functions
//     .runWith(runtimeOpts)
//     .storage
//     .object()
//     .onFinalize((object) => {
//         // do some complicated things that take a lot of memory and time
//     });