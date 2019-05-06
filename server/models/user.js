var mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    }
})

// var UserToAdd = new User({
//     name: 'Gamal shawer',
//     email: '  s '
// })

// UserToAdd.save().then((doc) => {
//     console.log('Saved sucessfuly !', doc)
// }, (err) => {
//     console.log('Unable To Save !')
// })

module.exports = {
    User
}