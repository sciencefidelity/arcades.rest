import * as dotenv from 'dotenv'
import Koa from 'koa'
import Router from 'koa-router'
import { Schema, model, connect } from 'mongoose'

dotenv.config({ path: '.env' })

// set up middleware
const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()
const connectionString = process.env.MONGO_ATLAS_STRING

const pug = new Pug({
  viewPath: Path.resolve(__dirname, './views'),
  basedir: Path.resolve(__dirname, './views'),
  app: app
})

interface User {
  name: string
  email: string
  avatar?: string;
}

const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
})

const UserModel = model<User>('User', schema)

run().catch(err => console.log(err))

async function run(): Promise<void> {
  await connect(connectionString!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const doc = new UserModel({
    name: 'matt',
    email: 'matt@mattis.cool',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  })
  await doc.save()

  console.log(doc.email)
}

router.get('/user', getUser)

async function(ctx, next) {
  await ctx.render('user')
}

// start server
app.use(router.routes())
   .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
