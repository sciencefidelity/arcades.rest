import Koa = require('koa')
import Router = require('koa-router')

const app = new Koa()
const port = 3000
const router = new Router()

router.get('/hello', async (ctx, next) => {
  ctx.body = 'Hello world!\n'
  await next()
})

router.post('/hello', async (ctx, next) => {
  ctx.body = "You just called the post method at '/hello'!\n"
  await next()
})

router.get('/not_found', async (ctx, next) => {
  ctx.status = 404
  ctx.body = 'You\'ve hit a route that doesn\'t exist'
  await next()
})

const handle404Errors = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
   if (404 != ctx.status) return
   ctx.redirect('/not_found')
   await next()
}

app
  .use(router.routes())
  .use(handle404Errors)
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
