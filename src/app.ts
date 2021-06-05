import * as dotenv from 'dotenv'
import Koa from 'koa'
import koaBody from 'koa-body'
import { connect, connection } from 'mongoose'
import routing from './routes'

dotenv.config({ path: '.env' })

// connect to database
const connectionString = process.env.MONGO_ATLAS_STRING
connect(connectionString!, { useNewUrlParser: true })
connection.on('error', console.error)

const app = new Koa()
const port = process.env.PORT

app.use(koaBody())

routing(app)

// start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
