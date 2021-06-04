import * as dotenv from 'dotenv'
import { model, connect } from 'mongoose'
import { User, userSchema } from './userSchema'

dotenv.config({ path: '.env' })

const connectionString = process.env.MONGO_ATLAS_STRING

const UserModel = model<User>('User', userSchema)

async function createUser(username:string) {
  return new UserModel({
    username,
    created: Date.now()
  }).save()
}

async function findUser(username:string) {
  return await UserModel.findOne({ username })
}

run().catch(err => console.log(err))

async function run(): Promise<void> {
  const connector = connect(connectionString!)
  const username = process.argv[2].split('=')[1]

  let user = await connector.then(async () => {
    return findUser(username)
  })

  if (!user) {
    user = await createUser(username)
  }

  console.log(user)
  process.exit(0)
}
