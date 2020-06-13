const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
var cors = require('cors');
const app = express();


const usersRef = db.collection("users");
const contactsRef = db.collection("contacts");

app.use(cors({ origin: true }));

app.post('/newContact', async (req, res) => {
  const { email, telephone, idContact } = req.query;
  let usersPhone = [];
  let usersEmail = [];
  let contactsUpdateArray = [];
  let listVinculed = [];
  try {
    let listUsersPhone = await usersRef.where('providerId', '==', 'phone').get(); //no habra telfonos repetidos
    if(listUsersPhone!==0){
      listUsersPhone.forEach(item => {
        if (telephone === item.data().telephone) {
          contactsUpdateArray.push(
            contactsRef.doc(idContact).update({ vinculed: item.data().uid })
          );
          const vin = { contactId: idContact, userId: item.data().uid };
          listVinculed.push(vin);
        }
      });
    }
    
    let listUsersEmail = await usersRef.where('providerId', '==', 'google.com').get();
    listUsersEmail.forEach(item => {
      if (email === item.data().email) {
        contactsUpdateArray.push(
          contactsRef.doc(idContact).update({ vinculed: item.data().uid })
        );
        const vin = { contactId: idContact, userId: item.data().uid };
        listVinculed.push(vin);
      }
    })
    
    Promise.all(contactsUpdateArray);
    res.status(200).send(listVinculed);

  } catch (error) {
    return res.status(400).send({ error });
  }
});


exports.requests = app;