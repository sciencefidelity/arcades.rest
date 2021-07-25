import Koa from "koa"
import path from "path"
import staticCache from "koa-static-cache"

const app = new Koa()

app.use(
  staticCache(path.join(__dirname, "./public"), {
    maxAge: 356 * 24 * 60 * 60,
  })
)
