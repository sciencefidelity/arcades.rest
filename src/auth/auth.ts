import { scrypt, randomBytes } from 'crypto'

export async function hash(password:string) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex')

    scrypt(password, salt, 64, (err:any, derivedKey:any) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString('hex'))
      console.log(derivedKey.toString('hex'))
    })
  })
}
