const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
var cors = require('cors');
const app = express();

const contactsRef = db.collection("contacts");
const blockedsRef = db.collection("blockeds");

app.use(cors({ origin: true }));

app.post('/newUser', async (req, res) => {
  const { providerId, uid } = req.query;
  let listLinked = [];
  let contactsUpdateArray = [];
  let listblockeds = []; //todos los bloqueados
  try {

    const blockeds = await blockedsRef.get();
    blockeds.forEach(item => {
      listblockeds.push(item.data());
    })

    if (providerId === 'phone') {
      const { telephone } = req.query;

      let auxBlocked = listblockeds.filter(block => block.telephone == telephone)
      if (auxBlocked.length !== 0) {
        await blockedsRef.add(
          {
            idUser: uid, //el bloqueado
            blocked_by: auxBlocked[0].blocked_by, //bloqueador
            created: new Date(),
          },
        );
      }

      let contacts = await contactsRef.where('telephone', '==', telephone).get();
      if (contacts.length !== 0) {
        contacts.forEach(item => {
          contactsUpdateArray.push(
            contactsRef.doc(item.id).update({ linked: uid })
          );
          const vinc = { contactId: item.id, userId: uid };
          listLinked.push(vinc);
        })
        Promise.all(contactsUpdateArray);
        res.status(200).send(listLinked);
      } else {
        res.status(200).send(listLinked);
      }
    }

    if (providerId === 'google.com') {
      const { email } = req.query;

      let auxBlocked = listblockeds.filter(block => block.email == email)
      if (auxBlocked.length !== 0) {
        await blockedsRef.add(
          {
            idUser: uid, //el bloqueado
            blocked_by: auxBlocked[0].blocked_by, //bloqueador
            created: new Date(),
          },
        );
      }

      let contacts = await contactsRef.where('email', '==', email).get();
      if (contacts.length !== 0) {
        contacts.forEach(item => {
          contactsUpdateArray.push(
            contactsRef.doc(item.id).update({ linked: uid })
          );
          const vinc = { contactId: item.id, userId: uid };
          listLinked.push(vinc);
        })
        Promise.all(contactsUpdateArray);
        res.status(200).send(listLinked);
      } else {
        res.status(200).send(listLinked);
      }
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
})

exports.requests = app;