import * as dotenv from 'dotenv'
import Koa from 'koa'
import Router from 'koa-router'
import Body from 'koa-body'
import { model, connect } from 'mongoose'
import { User, userSchema } from './userSchema'

dotenv.config({ path: '.env' })

const app = new Koa()
const port = process.env.PORT
const router = new Router
const connectionString = process.env.MONGO_ATLAS_STRING
const UserModel = model<User>('User', userSchema)

// connect to database
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json(User)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

// start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
