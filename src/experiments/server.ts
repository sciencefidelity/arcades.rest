import * as dotenv from "dotenv"
import Koa from "koa"
import serve from "koa-static"
import { networkInterfaces } from "os"

dotenv.config({ path: ".env" })

// init koa server
const server = new Koa()
const port = process.env.PORT || 3000

// get the local network address
let address: string
// eslint-disable-next-line array-callback-return
networkInterfaces().en0?.filter(details => {
  if (details.family === "IPv4") {
    address = details.address
  }
})

// serve static pages
server.use(serve("src/public"))

// start server
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
  console.log(`local network http://${address}:${port}`)
})
