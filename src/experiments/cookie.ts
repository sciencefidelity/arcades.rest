import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const port = process.env.PORT || 3000
const router = new Router()

const setCookie = (ctx: any) => {
  // expires after 360000 ms
  ctx.cookies.set('name', 'matt', {
    httpOnly: false,
    expires: 360000 + Date.now()
  })
  console.log('Cookies: name =', ctx.cookies.get('name'))
}

router.get('/', setCookie)

// start server
app.use(router.routes())
   .use(router.allowedMethods())
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
