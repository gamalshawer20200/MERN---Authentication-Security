const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {      //validator : validator.isEmail
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, { usePushEach: true });

// customize printed obj values to show
UserSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

//methods -> instance method
UserSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var token = jwt.sign({ '_id': user._id.toHexString(), access }, 'abc123').toString()

    user.tokens.push({ access, token })

    return user.save().then(() => {
        return token;
    })
}

//statics -> Model method
UserSchema.statics.findByToken = function (token) {
    var User = this  //User upper case as it model method
    var decoded;


    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        //console.log('****************error*************', e)
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject('authentication is required ! by promise <')
    }
    // console.log(decoded)

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,    //take care
        'tokens.access': 'auth'
    })
}


var User = mongoose.model('User', UserSchema)


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