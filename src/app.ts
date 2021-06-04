import * as dotenv from 'dotenv'
import Koa from 'koa'
import Router from 'koa-router'
import Body from 'koa-body'
import Path from 'path'
import Pug from 'koa-pug'

// load environment variables
dotenv.config({ path: '.env' })

// set up middleware
const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

const pug = new Pug({
  viewPath: Path.resolve(__dirname, './views'),
  basedir: Path.resolve(__dirname, './views'),
  app: app
})

// set up body parsing middleware
app.use(Body({
  formidable:{uploadDir: './uploads'},
  multipart: true,
  urlencoded: true
}))

async function renderForm(ctx: any) {
  await ctx.render('form')
}

const handleForm = (ctx: any) => {
  console.log(ctx.request.body)
  console.log(ctx.req.body)
  ctx.body = ctx.request.body
}

router.get('/', renderForm)
router.post('/', handleForm)

// start server
app.use(router.routes())
   .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
