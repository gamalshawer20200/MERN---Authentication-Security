const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const { todos, populateTodos, users, populateUsers } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

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


describe('GET / users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                // console.log(res.res)
                expect(res.body).toEqual({})
                expect(res.res.text).toBe('authentication is required ! by promise <')
            })

            .end(done)
    })
})


describe('POST /users', () => {
    it('Should create a user', (done) => {
        var user = {
            email: 'example@ex.com',
            password: '123abc'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(user.email)
                //console.log(res.body)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }

                User.findOne({ email: user.email }).then((userDoc) => {
                    expect(userDoc).toExist()
                    expect(userDoc.password).toNotBe(user.password)
                    done();
                }).catch((e) => done(e))
            })
    })

    it('Should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            //.send({email:'bbnuun',password:'123abc!'})
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe('User validation failed')
            })
            .end(done)
    })

    it('Should not create user if email in use', (done) => {
        var user = {
            email: users[0].email,
            password: '123abc'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .expect((res) => {
                expect(res.res.text).toBe('Duplicated email !!')
            })
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
                //console.log('**********************',res.body)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                //console.log(res.body)
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done()
                }).catch((e) => done(e))
            })

    })

    it('Should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[0].email, password: 'wrongPassword' })
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(res.text).toBe('pass is not correct !')

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})

