require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todoObj = new Todo({
        text: req.body.text,
        completed: true,
        completedAt: new Date().toLocaleString()
    })

    todoObj.save().then((doc) => {
        // console.log('Saved to Mongo', docs)
        res.send(doc);
    }, (err) => {
        // console.log('Unable to save !')
        res.status(400).send(err)
    })

});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', (req, res) => {
    id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((doc) => {
        if (!doc) {
            return res.status(404).send({ completed: 'no' });
        }
        res.status(200).send({ doc });
    }).catch((e) => {
        res.status(400).send();
    })

})

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }
    Todo.findByIdAndRemove(id).then((doc) => {
        if (!doc) {
            return res.status(404).send()
        }
        res.status(200).send({ doc })
    }).catch((e) => {
        return res.status(400).send();
    })
})

app.patch('/todos/:id', (req, res) => {
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
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((doc) => {
        if (!doc) { return res.status(404).send() }

        res.send({ doc })

    }).catch((e) => res.status(500).send())
})

app.listen(port, () => {
    console.log(`Started up at port : ${port}`)
});

module.exports = {
    app
};