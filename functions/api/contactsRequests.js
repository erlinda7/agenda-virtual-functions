const express = require("express");
const admin = require("../config/firebaseConfig");
const db = admin.firestore();
var cors = require('cors');
const app = express();


const usersRef = db.collection("users");
const contactsRef = db.collection("contacts");
const blockedsRef = db.collection("blockeds");

app.use(cors({ origin: true }));

app.post('/newContact', async (req, res) => {
  const { email, telephone, idContact, userEmail, userPhone, userId } = req.query; //userId del bloqueado
  let contactsUpdateArray = [];
  let listLinked = [];
  let listblockeds = []; //el que crea el contacto en la lista de bloqueados
  try {
    const blockeds = await blockedsRef.where('idUser', '==', userId).get();
    blockeds.forEach(item => {
      listblockeds.push(item.data());
    })


    let listUsersPhone = await usersRef.where('providerId', '==', 'phone').get(); //no habra telfonos repetidos
    listUsersPhone.forEach(item => {
      if (telephone === item.data().telephone && telephone !== userPhone) {
        const block = listblockeds.filter(block => block.blocked_by === item.data().uid);
        if (block.length === 0) {
          contactsUpdateArray.push(
            contactsRef.doc(idContact).update({ linked: item.data().uid })
          );
          const vin = { contactId: idContact, userId: item.data().uid };
          listLinked.push(vin);
        }
      }
    });

    let listUsersEmail = await usersRef.where('providerId', '==', 'google.com').get();
    listUsersEmail.forEach(item => {

      if (email === item.data().email && email !== userEmail) {
        const block = listblockeds.filter(block => block.blocked_by === item.data().uid);
        if (block.length === 0) {
          contactsUpdateArray.push(
            contactsRef.doc(idContact).update({ linked: item.data().uid })
          );
          const vin = { contactId: idContact, userId: item.data().uid };
          listLinked.push(vin);
        }
      }
    })

    Promise.all(contactsUpdateArray);
    res.status(200).send(listLinked);

  } catch (error) {
    return res.status(400).send({ error });
  }
});


exports.requests = app;