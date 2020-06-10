const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
const app = express();

const usersRef = db.collection("users");
const contactsRef = db.collection("contacts");

// app.get("/contatcs", async (req, res) => {
//   res.send("ruta contactas!");
// });

app.post('/newContact', async (req, res) => {
  const { email, telephone, idContact } = req.query;
  let usersPhone = [];
  let usersEmail = [];
  let vinculed = false;
  try {
    let listUsersPhone = await usersRef.where('providerId', '==', 'phone').get();
    listUsersPhone.forEach(item => {
      let user = { ...item.data(), id: item.id };
      usersPhone.push(user);
    })

    let listUsersEmail = await usersRef.where('providerId', '==', 'google.com').get();
    listUsersEmail.forEach(item => {
      let user = { ...item.data(), id: item.id };
      usersEmail.push(user);
    })

    if (usersPhone.length !== 0) {
      const phone = `+${telephone}`.replace(/ /g, "");
      let userP = usersPhone.filter(item => item.telephone === phone);
      if (userP.length !== 0) {
        let uidPhone = userP[0].uid;
        const update = await contactsRef.doc(idContact).update({ vinculed: uidPhone })
        vinculed = uidPhone;
      }
    }

    if (usersEmail.length !== 0) {
      let userE = usersEmail.filter(item => item.email === email);

      if (userE.length !== 0) {

        console.log('userE', userE);
        let uidEmail = userE[0].uid;
        const update = await contactsRef.doc(idContact).update({ vinculed: uidEmail })
        vinculed = uidEmail;
      }
    }

    res.status(200).send({ vinculed: vinculed });

  } catch (error) {
    return res.status(400).send({ error });
  }
});


exports.requests = app;