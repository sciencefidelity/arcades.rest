import * as dotenv from 'dotenv'
import Koa from 'koa'
import Router from 'koa-router'
import { connect } from 'mongoose'
import { UserModel } from './userSchema'

dotenv.config({ path: '.env' })

const app = new Koa()
const port = process.env.PORT
const router = new Router
const connectionString = process.env.MONGO_ATLAS_STRING

// connect to database
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json(UserModel)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

// start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
