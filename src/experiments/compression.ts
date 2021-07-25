import Koa from "koa"
import Path from "path"
import Compress from "koa-compress"
import Router from "koa-router"
import Pug from "koa-pug"
import Serve from "koa-static"

const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

// eslint-disable-next-line no-unused-vars
const pug = new Pug({
  viewPath: Path.resolve(__dirname, "./views"),
  basedir: Path.resolve(__dirname, "./views"),
  app: app
})

// load stylesheet
const styles = Path.resolve(__dirname, "./public/style.css")

app.use(
  Compress({
    filter(contentType) {
      return /text/i.test(contentType)
    },
    threshold: 2048,
    gzip: {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      flush: require("zlib").constants.Z_SYNC_FLUSH
    },
    deflate: {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      flush: require("zlib").constants.Z_SYNC_FLUSH
    },
    br: false // disable brotli
  })
)

// eslint-disable-next-line space-before-function-paren
const getRoot = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await ctx.render("index", {
    styles: styles
  })
  console.log(ctx.request)
  console.log(ctx.response)
  await next()
}

router.get("/", getRoot)

// start server
app
  .use(Serve(Path.join(__dirname, "public")))
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
