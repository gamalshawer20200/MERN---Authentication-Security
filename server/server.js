require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate')

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    //console.log(req.body);
    var todoObj = new Todo({
        text: req.body.text,
        completed: true,
        completedAt: new Date().toLocaleString(),
        _creator: req.user._id
    })

    todoObj.save().then((doc) => {
        // console.log('Saved to Mongo', docs)
        res.send(doc);
    }, (err) => {
        // console.log('Unable to save !')
        res.status(400).send(err)
    })

});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', authenticate, (req, res) => {
    id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((doc) => {
        if (!doc) {
            return res.status(404).send({ completed: 'no' });
        }
        res.status(200).send({ doc });
    }).catch((e) => {
        res.status(400).send();
    })

})

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((doc) => {
        if (!doc) {
            return res.status(404).send()
        }
        res.status(200).send({ doc })
    }).catch((e) => {
        return res.status(400).send();
    })
})

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']) //there are the only attributes that the user can update
    console.log(body)
    if (!ObjectID.isValid(id)) { return res.status(404).send() }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().toLocaleString();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    // new : false -> it return the old doc (which've been updated .. currently notExist)
    // new : true -> it return the new doc (which will replace the old one ... currently Exist)
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, { $set: body }, { new: true }).then((doc) => {
        if (!doc) { return res.status(404).send() }

        res.send({ doc })

    }).catch((e) => res.status(500).send())
})

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body)
    /* 
        User.findByToken           // Model methods
        newUser.generateAuthToken  // instance methods */


    user.save().then(() => {
        return user.generateAuthToken()
        // var x = user.generateAuthToken()
        // console.log(x) 
        /* the return value is promise that should return to the next "then" ,
        Here in comment section i print the returned value 
        but do not return it which result in cant resolve or reject this promise so we do not move to run the code of then inwhich we set headers  */
    }).then((token) => {
        //console.log('headers set successfuly !')
        res.header('x-auth', token).send(user)

    }).catch((e) => {
        if (e.code === 11000) {
            return res.status(400).send('Duplicated email !!')
        }
        res.status(400).send(e)
    })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    User.findByCredentials(body.email, body.password).then((result) => {
        //res.status(200).send(`Status : ${result.message} \n User-obj :${result.user}`)
        return result.user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(result.user)
        })
    }).catch((e) => {
        res.status(404).send(e)
    })
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => {
        res.status(400).send()
    })
})

app.listen(port, () => {
    console.log(`Started up at port : ${port}`)
});

module.exports = {
    app
};