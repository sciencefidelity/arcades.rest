import { compare } from "bcryptjs"
import { UserModel } from "../models/userSchema"

const Authenticate = (username: string, password: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line space-before-function-paren
    ;(async () => {
      try {
        // get user by email
        const user = await UserModel.findOne({ username })
        if (!user) {
          throw new Error("authentication failed")
        }
        if (user) {
          // match password
          compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
              resolve(user)
            } else {
              // password didn't match
              reject(new Error("authentication failed"))
            }
          })
        }
      } catch (err) {
        // email not found
        reject(new Error("authentication failed"))
      }
    })()
  })
}

export default Authenticate
