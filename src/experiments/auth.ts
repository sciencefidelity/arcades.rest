import Koa from 'koa'
import Auth from 'koa-basic-auth'
import Router from 'koa-router'

const credentials = { name: 'matt', pass: 'iscool' }
const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

// custom 401 handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'Not today thank you.'
    } else {
      throw err
    }
  }
})

// unprotected route
router.get('/protected', Auth(credentials), ctx => {
  ctx.body = 'You\'re on the guest list.'
})

// protected route
router.get('/unprotected', ctx => {
  ctx.body = 'Free for all!'
})

app.use(router.routes())
   .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
