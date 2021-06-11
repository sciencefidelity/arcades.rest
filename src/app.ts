import * as dotenv from 'dotenv'
import Koa from 'koa'
import kjwt from 'koa-jwt'
import Mongoose from 'mongoose'
import koaBody from 'koa-body'
import error from 'koa-json-error'

import mainRoute from './routes/index'
import arcadesRoute from './routes/arcades'
import usersRoute from './routes/users'

dotenv.config({ path: '.env' })

const connectionString = process.env.MONGO_ATLAS_STRING

Mongoose.connect(connectionString!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
Mongoose.connection.on('error', console.error)

const app = new Koa()
const port = process.env.PORT
let secret
if (process.env.JWT_SECRET) {
  secret = process.env.JWT_SECRET
} else {
  throw new Error('secret environment variable is not set')
}

app.use(koaBody({
  formidable:{uploadDir: './uploads'},
  multipart: true,
  urlencoded: true
}))

app.use(kjwt({ secret }).unless({ path: ['/users/auth'] }))

app.use(mainRoute.routes())
   .use(mainRoute.allowedMethods())
   .use(arcadesRoute.routes())
   .use(arcadesRoute.allowedMethods())
   .use(usersRoute.routes())
   .use(usersRoute.allowedMethods())
   .use(error())

// start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
