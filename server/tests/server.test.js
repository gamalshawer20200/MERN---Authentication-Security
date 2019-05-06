const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}]


beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
})

describe('POST /todos', () => {
    it('Should create a new Todo', (done) => {
        var text = 'Test todo Text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    // expect(todo).toInclude({
                    //     text:'Test todo Text'
                    // })
                    done();
                }).catch((e) => {
                    return done(e);
                })
            })
    });

    it('Should not create todo with invalid body data', (done) => {
        var tobj = {
            text: ''
        }
        request(app)
            .post('/todos')
            .send(tobj)
            .expect(400)
            .end((err, res) => {
                if (err) { return done(err); }
            })

        Todo.find().then((todo) => {
            expect(todo.length).toBe(2)
            done();
        }).catch((e) => done(e))
    })

})

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                //console.log(res.body)
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
});

describe('GET /todos/:id', () => {
    it('Should get the doc with spicified ID', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('Should return 404 if doc not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.completed).toBe('no')
            })
            .end(done)

    })

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    })
})

describe('DELETE /todos', () => {
    it('Shloud remove the specified id', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toBe('Second test todo')
            })
            .end((err, res) => {
                if (err) { return done(err) }

                Todo.findById(hexId).then((doc) => {
                    expect(doc).toNotExist();
                    done();
                }).catch((e) => done(e))
            })

    })

    it('Should return 404 if not found doc to remove', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString}`)
            .expect(404)
            .end(done)
    })

    it('Should return 404 if object id invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done)
    })

})

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var body = { text: 'Jemii', completed: true }
        var hexId = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.completed).toBe(true)
                expect(res.body.doc.completedAt).toBeA('string') //as i use new Date().tolocaleString instead of ( new Date().getTime() which return a number || timeStamp )
            })
            .end(done)
    })

    it('Should Clear completedAt when todo is not completed', (done) => {
        var body = { text: 'Gamaaaaal', completed: false }
        var hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.completed).toBe(false)
                expect(res.body.doc.completedAt).toNotExist()
            })
            .end(done)
    })
})

