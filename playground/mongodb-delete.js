const { MongoClient, ObjectID } = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to Mongodb Server !')
    }
    console.log('Connected to mongoDB Server !')

    //deleteMany
    // db.collection('Users').deleteMany({ name: 'fady' }).then((result) => {
    //     console.log(result)
    // })

    //deleteOne
    // db.collection('Users').deleteOne({ name: 'Gamal' }).then((result) => {
    //     console.log(result.result.n)
    // })

    //findOneAndDelete
    db.collection('Users').findOneAndDelete({ completed: "false" }).then((res) => {
        console.log(res)
    })

    db.close();
});