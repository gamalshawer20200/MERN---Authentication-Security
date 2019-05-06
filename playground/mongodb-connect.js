// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID(); //unique value every time !:D
// console.log(obj)

// var user = { name: 'jemi', age: 22 }
// var { name } = user; //Destructuring -> extract single attribute from object to be a variable with same name of the object's attribute
// console.log(name)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to Mongodb Server !')
    }
    console.log('Connected to mongoDB Server !')

    // db.collection('Todos').insertOne({
    //     name:"Jemiiiiii"

    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    /*     db.collection('Users').insertOne({
            name:"Gamal",
            Location:"Maadi,Cairo",
            age:22
        },(err,results)=>{
            if (err) {
                return console.log('Unable to connect to User Collection !')
            }
            console.log(JSON.stringify(results.ops,undefined,3))
        }) */

    db.close();
});