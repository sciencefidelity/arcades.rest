import koa = require('koa')
import Router = require('koa-router')

const app = new koa()
const port = 3000
const router = new Router()

router.get('/hello', (ctx, next) => {
  ctx.body = 'Hello world!\n'
})

router.post('/hello', (ctx, next) => {
  ctx.body = "You just called the post method at '/hello'!\n"
})

router.get('/not_found', (ctx, next) => {
  ctx.status = 404
  ctx.body = 'You\'ve hit a route that doesn\'t exist'
})

const handle404Errors = (ctx: any, next: any) => {
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