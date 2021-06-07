import * as dotenv from 'dotenv'
import Koa from 'koa'
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
  useUnifiedTopology: true
})
Mongoose.connection.on('error', console.error)

const app = new Koa()
const port = process.env.PORT

app.use(koaBody({
  formidable:{uploadDir: './uploads'},
  multipart: true,
  urlencoded: true
}))

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
