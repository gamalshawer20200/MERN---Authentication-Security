const { MongoClient, ObjectID } = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to Mongodb Server !')
    }
    console.log('Connected to mongoDB Server !')

    //db.collection().findOneAndUpdate({},{ $set{},.. },{}).then()
    db.collection('Users').findOneAndUpdate({
        name: 'Jamjoom'
    }, {
            $set: {
                name: 'Gamal'
            },
            $inc:{
                age: 1
            }
        }, {
            retrunOriginal: false
        }).then((results) => {
            console.log(results)
        })

    db.close();
});