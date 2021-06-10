import { compare } from 'bcryptjs'
import { userModel } from '../models/userSchema'
// import * as mongoose from 'mongoose'
// const UserModel = mongoose.model('User')

export const Authenticate = (username:string, password:string) => {
  return new Promise(async (resolve, reject) => {
    try {
      //get user by email
      const user = await userModel.findOne({ username })

      if (!user) {
        throw(422)
      }
      // match password
      compare(password, user.password, (err, isMatch) => {
        if(err) throw err
        if(isMatch) {
          resolve(user)
        } else {
          // password didn't match
          reject('authentication failed')
        }
      })
    } catch(err) {
      // email not found
      reject('authentication failed')
    }
  })
}
