import Koa = require("koa")
import Router = require("koa-router")

const app = new Koa()
const port = 3000
const router = new Router()

router.get("/:name", (ctx, next) => {
  ctx.body = "The coolest person is " + ctx.params.name + "!"
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
