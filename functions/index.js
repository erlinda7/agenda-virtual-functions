const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require("./config/firebaseConfig");


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.API_GET_USERS = functions.https.onRequest((request, response) => {
  // const firestore = firebase.firestore();
  // firestore.settings({ timestampsInSnapshots: true });

  const usersRef = admin.firestore().collection('users');

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

      return response.json({ users: users });
    })
    .catch(err => {
      return response.json({ error: err });
    })
});


// The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// admin.initializeApp();