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

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
