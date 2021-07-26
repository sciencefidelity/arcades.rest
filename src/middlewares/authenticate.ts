import { compare } from "bcryptjs"
import { UserModel } from "../models/userSchema"

export const Authenticate = (username:string, password:string) => {
  // eslint-disable-next-line space-before-function-paren
  return new Promise(async (resolve, reject) => {
    try {
      // get user by email
      const user = await UserModel.findOne({ username })
      if (!user) {
        throw(422)
      }
      // match password
      compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          resolve(user)
        } else {
          // password didn't match
          reject("authentication failed")
        }
      })
    } catch (err) {
      // email not found
      reject("authentication failed")
    }
  })
}
