const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
}


// process.env.NODE_ENV = 'production'     ==> heroku
// process.env.NODE_ENV = 'Development'    ==> when we run the app localy
// process.env.NODE_ENV = 'test'           ==> when we run our app through mocha