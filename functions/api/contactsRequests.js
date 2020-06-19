const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
var cors = require('cors');
const app = express();


const usersRef = db.collection("users");
const contactsRef = db.collection("contacts");

app.use(cors({ origin: true }));

app.post('/newContact', async (req, res) => {
  const { email, telephone, idContact, userEmail, userPhone } = req.query;
  let usersPhone = [];
  let usersEmail = [];
  let contactsUpdateArray = [];
  let listLinked = [];
  try {
    let listUsersPhone = await usersRef.where('providerId', '==', 'phone').get(); //no habra telfonos repetidos
    if (listUsersPhone !== 0) {
      listUsersPhone.forEach(item => {
        if (telephone === item.data().telephone && telephone !== userPhone) {
          contactsUpdateArray.push(
            contactsRef.doc(idContact).update({ linked: item.data().uid })
          );
          const vin = { contactId: idContact, userId: item.data().uid };
          listLinked.push(vin);
        }
      });
    }

    let listUsersEmail = await usersRef.where('providerId', '==', 'google.com').get();
    listUsersEmail.forEach(item => {
      if (email === item.data().email && email !== userEmail) {
        contactsUpdateArray.push(
          contactsRef.doc(idContact).update({ linked: item.data().uid })
        );
        const vin = { contactId: idContact, userId: item.data().uid };
        listLinked.push(vin);
      }
    })

    Promise.all(contactsUpdateArray);
    res.status(200).send(listLinked);

  } catch (error) {
    return res.status(400).send({ error });
  }
});


exports.requests = app;