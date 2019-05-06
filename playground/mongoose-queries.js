
const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')

var id = '5cc8858869506698253abdb7';

if (!ObjectID.isValid(id)){
    return console.log('ID is invalid !')
}

Todo.find({
    _id: id
}).then((todos) => {
    // if (!todos[0]) {
    //     return console.log('ID not found !')
    // }
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('ID not found !')
    }
    console.log('Todo by ID', todo);
}).catch((e) => console.log(e))