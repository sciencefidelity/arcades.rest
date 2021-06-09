// import { compare } from 'bcryptjs'
// import { model, Document } from 'mongoose'
// const User = model<Document>('User')
import { userModel } from '../models/userSchema'

const auth = (email:string, password:string) => {
  return new Promise(async (resolve, reject) => {
    try {
      //get user by email
      const user = await userModel.find({ email })
      console.log(user)
      // match password
      // compare(password, user.password, (err, result) => {
      //   if(err) throw err
      //   if(result) {
      //     resolve(user)
      //   } else {
      //     // password didn't match
      //     reject('authentication failed')
      //   }
      // })
    } catch(err) {
      // email not found
      reject('authentication failed')
    }
  })
}

export default auth
