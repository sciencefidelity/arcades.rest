// require('dotenv').config()
//
// const connectionString = process.env.MONGO_ATLAS_STRING
//
// const mongoose = require('mongoose')
// const userSchema = require('./userSchema.js')
// const User = mongoose.model('user', userSchema, 'user')
//
// async function createUser(username) {
//   return new User({
//     username,
//     created: Date.now()
//   }).save()
// }
//
// async function findUser(username) {
//   return await User.findOne({ username })
// }
//
// ;(async () => {
//   const connector = mongoose.connect(connectionString)
//   const username = process.argv[2].split('=')[1]
//
//   let user = await connector.then(async () => {
//     return findUser(username)
//   })
//
//   if (!user) {
//     user = await createUser(username)
//   }
//
//   console.log(user)
//   process.exit(0)
// })()

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
