import Koa = require('koa')
import path = require('path')
import Pug from 'koa-pug'

const app = new Koa()
const port = 3000

const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  basedir: path.resolve(__dirname, './views'),
  app
})

app.use(async ctx => {
  await ctx.render('index', true)
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
