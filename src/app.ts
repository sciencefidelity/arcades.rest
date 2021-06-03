import Koa from 'koa'
import Path from 'path'
import Router from 'koa-router'
import Pug from 'koa-pug'

const app = new Koa()
const port = 3000
const router = new Router()

const pug = new Pug({
  viewPath: Path.resolve(__dirname, './views'),
  basedir: Path.resolve(__dirname, './views'),
  app: app
})

router.get('/hello', async (ctx) => {
  await ctx.render('index')
})

router.get('/not_found', async (ctx) => {
  ctx.status = 404
  await ctx.render('404')
})

const handle404Errors = (ctx: any) => {
   if (404 != ctx.status) return;
   ctx.redirect('/not_found');
}

app
  .use(router.routes())
  .use(handle404Errors)
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
