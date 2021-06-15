import * as dotenv from 'dotenv'
import Koa from 'koa'
import Path from 'path'
import Pug from 'koa-pug'
import Router from 'koa-router'
import Serve from 'koa-static'

// load environment variables
dotenv.config({ path: '.env' })

// set up middleware
const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

// load html templates
const pug = new Pug({
  viewPath: Path.resolve(__dirname, './views'),
  basedir: Path.resolve(__dirname, './views'),
  app: app
})

// load stylesheet
const styles = Path.resolve(__dirname, './public/style.css')

// set up routes
router.get('/:name', async (ctx) => {
  await ctx.render('index', {
    name: ctx.params.name.charAt(0).toUpperCase() + ctx.params.name.slice(1),
    styles: styles
  })
})

// handle 404 errors
router.get('/not_found', async (ctx) => {
  ctx.status = 404
  await ctx.render('404')
})
const handle404Errors = (ctx: Koa.ParameterizedContext) => {
   if (404 != ctx.status) return
   ctx.redirect('/not_found')
}

// start server
app.use(Serve(Path.join(__dirname, 'public')))
   .use(router.routes())
   .use(handle404Errors)
   .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
