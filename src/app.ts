import * as dotenv from 'dotenv'
import Koa from 'koa'
import koaBody from 'koa-body'
// import { connect, connection } from 'mongoose'
// import arcades from './routes/arcades'

dotenv.config({ path: '.env' })

const app = new Koa()
const port = process.env.PORT

// connect to database
// const connectionString = process.env.MONGO_ATLAS_STRING
// connect(connectionString!, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// connection.on('error', console.error)

app.use(koaBody({
  formidable:{uploadDir: './uploads'},
  multipart: true,
  urlencoded: true
}))

// start server
app.listen(port, () => {
  require('./routes/arcades')(app)
  console.log(`Listening at http://localhost:${port}`)
})
