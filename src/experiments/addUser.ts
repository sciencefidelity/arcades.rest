import * as dotenv from 'dotenv'
import { connect } from 'mongoose'
import { userModel } from '../models/userSchema'

dotenv.config({ path: '.env' })

const connectionString = process.env.MONGO_ATLAS_STRING

run().catch(err => console.log(err))

async function run(): Promise<void> {
  await connect(connectionString!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const doc = new userModel({
    username: 'john',
    email: 'john@johnis.blue',
    avatar: 'https://i.imgur.com/dM7Thhn.png',
    created: Date.now()
  })
  await doc.save()
}
