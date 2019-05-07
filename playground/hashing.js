const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var pass = 'pass123abc!'

// bcrypt.genSalt(10, (err, salt) => {     //10 -> number of rounds
//     bcrypt.hash(pass, salt, (err, hash) => {
//         console.log(hash)
//     })
// })

var hashedPasswod = '$2a$10$ag7Tl6/DTX/8Fr5EvyX0luKZmGAygbOrTM8fdrLF6sbUPKDQeOgEq'

bcrypt.compare(pass, hashedPasswod, (err, res) => {
    console.log(res)
})



//------------------------------------------------------------------------




/* var data = {
    id: 10
}

var token = jwt.sign(data, '123abc')
console.log(token)

var decoded = jwt.verify(token, '123abc')
console.log('decoded',decoded)
 */


//----------------------------------------------------------------



// var message ='i am User number 55'

// var hash = SHA256(message).toString()

// // console.log(`Message : ${message}`)
// // console.log(`hashed Message : ${hash}`)

// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// token.data.id = 5;

// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString()

// if(resultHash === token.hash){
//     console.log('Data was not changed')
// }else{
//     console.log('Data was changed, Do not trust !')
// }