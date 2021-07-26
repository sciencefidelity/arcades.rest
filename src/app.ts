import * as dotenv from "dotenv"
import Koa from "koa"
import koaBody from "koa-body"
import error from "koa-json-error"
import Mongoose from "mongoose"
import { networkInterfaces } from "os"

import arcadesRoute from "./routes/arcades"
import mainRoute from "./routes/index"
import usersRoute from "./routes/users"

dotenv.config({ path: ".env" })

// conect to DB
const connectionString = process.env.MONGO_ATLAS_STRING
Mongoose.connect(connectionString!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
Mongoose.connection.on("error", console.error)

// init koa server
const app = new Koa()
const port = process.env.PORT || 3000

// get the local network address
let address: string
// eslint-disable-next-line array-callback-return
networkInterfaces().en0?.filter(details => {
  if (details.family === "IPv4") {
    address = details.address
  }
})

app.use(
  koaBody({
    formidable: { uploadDir: "./uploads" },
    multipart: true,
    urlencoded: true
  })
)

app
  .use(mainRoute.routes())
  .use(mainRoute.allowedMethods())
  .use(arcadesRoute.routes())
  .use(arcadesRoute.allowedMethods())
  .use(usersRoute.routes())
  .use(usersRoute.allowedMethods())
  .use(error())

// start server
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
  console.log(`local network http://${address}:${port}`)
})
