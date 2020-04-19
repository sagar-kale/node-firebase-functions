const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.region('asia-east2').https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.onUserImageChange = functions
  .region('asia-east2')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().photoURL !== change.after.data().photoURL) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('projects')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/projects/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().photoURL });
          });
          return batch.commit();
        });
    } else return true;
  });
