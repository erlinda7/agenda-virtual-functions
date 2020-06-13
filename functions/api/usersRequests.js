const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
var cors = require('cors');
const app = express();

const contactsRef = db.collection("contacts");
app.use(cors({ origin: true }));

app.post('/newUser', async (req, res) => {
  const { providerId, uid } = req.query;
  let listVinculed = [];
  let contactsUpdateArray = [];
  try {
    if (providerId === 'phone') {
      const { telephone } = req.query;
      let contacts = await contactsRef.where('telephone', '==', telephone).get();
      if (contacts.length !== 0) {
        contacts.forEach(item => {
          contactsUpdateArray.push(
            contactsRef.doc(item.id).update({ vinculed: uid })
          );
          const vinc = { contactId: item.id, userId: uid };
          listVinculed.push(vinc);
        })
        Promise.all(contactsUpdateArray);
        res.status(200).send(listVinculed);
      } else {
        res.status(200).send(listVinculed);
      }
    }

    if (providerId === 'google.com') {
      const { email } = req.query;
      let contacts = await contactsRef.where('email', '==', email).get();
      if (contacts.length !== 0) {
        contacts.forEach(item => {
          contactsUpdateArray.push(
            contactsRef.doc(item.id).update({ vinculed: uid })
          );
          const vinc = { contactId: item.id, userId: uid };
          listVinculed.push(vinc);
        })
        Promise.all(contactsUpdateArray);
        res.status(200).send(listVinculed);
      } else {
        res.status(200).send(listVinculed);
      }
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
})

exports.requests = app;