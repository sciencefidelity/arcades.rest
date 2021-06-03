import * as dotenv from 'dotenv'
import Koa from 'koa'
import Path from 'path'
import Pug from 'koa-pug'
import Router from 'koa-router'
import Serve from 'koa-static'

dotenv.config({ path: '.env' })

const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

const pug = new Pug({
  viewPath: Path.resolve(__dirname, './views'),
  basedir: Path.resolve(__dirname, './views'),
  app: app
})

const styles = Path.resolve(__dirname, './views/css/style.css')

router.get('/:name', async (ctx) => {
  await ctx.render('index', {
    name: ctx.params.name.charAt(0).toUpperCase() + ctx.params.name.slice(1),
    styles: styles
  })
})

router.get('/not_found', async (ctx) => {
  ctx.status = 404
  await ctx.render('404')
})

const handle404Errors = (ctx: any) => {
   if (404 != ctx.status) return;
   ctx.redirect('/not_found');
}

app.use(Serve(Path.join(__dirname, 'public')))

app
  .use(router.routes())
  .use(handle404Errors)
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
