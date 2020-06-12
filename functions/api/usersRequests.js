const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
var cors = require('cors');
const app = express();

const contactsRef = db.collection("contacts");
// app.get("/users", async (req, res) => {
//   res.send("ruta users!");
// });
//app.use(cors());
app.use(cors({ origin: true }));

app.post('/newUser', async (req, res) => {
  const { providerId, uid } = req.query;
  let contacts = false;
  try {

    if (providerId === 'phone') {
      const { telephone } = req.query;
      // const phone = `+${telephone}`.replace(/ /g, "");
      // console.log('tel:', phone);
      
      let listContacts = await contactsRef.where('telephone', '==', telephone).get();
      listContacts.forEach(item => {
        contacts = { ...item.data(), id: item.id };
      })
      if (contacts !== false) {
        const update = await contactsRef.doc(contacts.id).update({ vinculed: uid })
        res.status(200).send({ vinculed: uid })
      } else {
        res.status(200).send({ vinculed: 'notVinculed' })
      }
    }

    if (providerId === 'google.com') {
      const { email } = req.query;
      let listContacts = await contactsRef.where('email', '==', email).get();
      listContacts.forEach(item => {
        contacts = { ...item.data(), id: item.id };
      })
      if (contacts !== false) {
        const update = await contactsRef.doc(contacts.id).update({ vinculed: uid })
        res.status(200).send({ vinculed: uid })
      } else {
        res.status(200).send({ vinculed: 'notVinculed' })
      }
    }

  } catch (error) {
    return res.status(400).send({ error });
  }
})

exports.requests = app;