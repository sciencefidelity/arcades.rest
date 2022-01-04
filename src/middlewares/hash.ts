import bcrypt from "bcryptjs"
import { scrypt, randomBytes } from "crypto"

// hash password with scrypt
export async function scryptHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex")
    scrypt(password, salt, 64, async (err, derivedKey) => {
      if (err) reject(err)
      resolve(`${salt}:${derivedKey.toString("hex")}`)
    })
  })
}

// hash password with bcrypt
export async function bcryptHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (_err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  })
}
