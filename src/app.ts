import Koa from 'koa'
import Session from 'koa-session'

const app = new Koa()
const port = process.env.PORT || 3000

const CONFIG = {}

app.keys = [ 'A super secret key.' ]
app.use(Session(CONFIG, app))

app.use(ctx => {
  if (ctx.path === '/favicon.ico') return

  let n = ctx.session!.views || 0
  ctx.session!.views = ++n

  if(n === 1)
    ctx.body = 'It\'s my first time!'
  else
    ctx.body = 'You\'ve done this ' + n + ' times!'
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
