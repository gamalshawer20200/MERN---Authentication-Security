const { MongoClient, ObjectID } = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to Mongodb Server !')
    }
    console.log('Connected to mongoDB Server !')
// .find return a cursor or a pointer -> .toArray() returns a promise
    // db.collection('Users').find({completed:'true'},{_id:0}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch the data !', err)
    // })

    // db.collection('Users').find().count().then((count) => {
    //     console.log(`Users Count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch the data !', err)
    // })

    db.collection('Users').find().toArray().then((docs) => {
        
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch the data !',err) 
    })

    db.close();
});