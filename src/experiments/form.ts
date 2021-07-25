import * as dotenv from "dotenv"
import Koa from "koa"
import Router from "koa-router"
import Body from "koa-body"
import Path from "path"
import Pug from "koa-pug"

// load environment variables
dotenv.config({ path: ".env" })

// set up middleware
const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

// eslint-disable-next-line no-unused-vars
const pug = new Pug({
  viewPath: Path.resolve(__dirname, "./views"),
  basedir: Path.resolve(__dirname, "./views"),
  app: app
})

// set up body parsing middleware
app.use(
  Body({
    formidable: { uploadDir: "./uploads" },
    multipart: true,
    urlencoded: true
  })
)

// eslint-disable-next-line space-before-function-paren
const renderForm = async (ctx: Koa.ParameterizedContext) => {
  await ctx.render("form")
}

const handleForm = (ctx: Koa.ParameterizedContext) => {
  console.log(ctx.request.body)
  ctx.body = ctx.request.body
}

router.get("/", renderForm)
router.post("/", handleForm)

// start server
app.use(router.routes()).use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
