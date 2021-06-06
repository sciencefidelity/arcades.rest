import * as dotenv from 'dotenv'
import Koa from 'koa'
import koaBody from 'koa-body'
import mainRoute from './routes/index'
import arcadesRoute from './routes/arcades'

dotenv.config({ path: '.env' })

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

// start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
