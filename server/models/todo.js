var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: String,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});



// SecondTodo.save().then((docs) => {
//     console.log('Saved to Mongo', docs)
// }, (err) => {
//     console.log('Unable to save !')
// })

module.exports = {
    Todo
}