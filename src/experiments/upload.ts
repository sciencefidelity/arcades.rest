import * as dotenv from 'dotenv'
import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
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

app.use(koaBody({
  formidable:{uploadDir: Path.resolve(__dirname, './uploads')},
  multipart: true,
  urlencoded: true
}))

async function renderForm(ctx: Koa.ParameterizedContext) {
  await ctx.render('file_upload')
}

const handleForm = (ctx: Koa.ParameterizedContext) => {
  console.log('Files: ', ctx.request.files)
  console.log('Fields: ', ctx.request.body.fields)
  ctx.body = 'Recieved your data!'
}

router.get('/files', renderForm)
router.post('/upload', koaBody(), handleForm)

// start server
app.use(router.routes())
   .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
