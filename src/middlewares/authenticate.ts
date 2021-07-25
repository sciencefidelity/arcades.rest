import { compare } from "bcryptjs"
import { UserModel } from "../models/userSchema"

export const Authenticate = (username: string, password: string) => {
  // eslint-disable-next-line space-before-function-paren
  return new Promise(async (resolve, reject) => {
    try {
      // get user by email
      const user = await UserModel.findOne({ username })
      if (!user) {
        throw Error("authentication failed")
      }
      // match password
      compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          Promise.resolve(user)
        } else {
          // password didn't match
          Promise.reject(new Error("authentication failed"))
        }
      })
    } catch (err) {
      // email not found
      Promise.reject(new Error("authentication failed"))
    }
  })
}
