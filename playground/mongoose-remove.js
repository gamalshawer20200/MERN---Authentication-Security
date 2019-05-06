const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')

// Todo.remove({}).then((results) => {
//     console.log(results); // results.result.n -> the useful output it detects how many docs had been removed
// })

// Todo.findByIdAndRemove({ text: 'jemi' }).then((doc) => {
//     console.log(doc)
// })

Todo.findByIdAndRemove('5cc9abd4a187f818d46f1fa9').then((doc) => {
    if (!doc) { return console.log('Detected !') } //when id is not found in docs
    console.log(doc)
}).catch((e) => {
    console.log(e.message) //when id is formulate wrong  example -> 123abc
})