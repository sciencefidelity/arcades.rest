import Koa from 'koa'

const app = new Koa()
const port = 3000

app.use(async ctx => {
  ctx.body = 'Hello matt!'
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
