const functions = require('firebase-functions');
const admin=require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase, Marcos Corregido");
  console.log('En Consola');
 });

 exports.addMessage=functions.https.onRequest((req, res)=>{
     const texto=req.query.text;
     admin.database().ref('/messages').push({texto}).then(snapshot =>{
         res.redirect(303, snapshot.ref);
     })
 })

 exports.createdMessage=functions.database.ref('messages/{pushId}')
 .onWrite(event => {
         console.log('Escrito en messages ', event.data.val());
         console.log('param', event.params.pushId);
         return null;
     });

exports.deleteMessage= functions.database.ref('messages/{pushId}')
.onDelete(event=> {
    console.log('Borrado el mensaje', event.data.previous.val());
    console.log('su id era: ', event.params.pushId);
    return null;
});

exports.createUser= functions.auth.user()
.onCreate(event=> {
    console.log('usuario creado');
    const uid=event.data.uid;
    const newUser={
        name:event.data.displayName || 'Nombre desconocido',
        email: event.data.email || 'no.email@example.com',
        picture: event.data.photoURL || 'https://desarrolloweb.com/archivoimg/general/4411.png'
    }
    console.log(newUser);
    let ref=admin.database().ref('/users/${uid}');
    return ref.set(newUser);
});

exports.onDeleteUser=functions.auth.user()
.onDelete(event =>{
    console.log('usuario borrado');
    const uid = event.data.uid;
    let ref=admin.database().ref('/users/${uid}');
    return ref.update({isDeleted: true});
})