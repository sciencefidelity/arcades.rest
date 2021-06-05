import Router from 'koa-router'

const router = new Router()

module.exports = app => {
  router.get('/users', (req:any, res:any, next:any) => {
    res.send({ msg: 'test' })
  })
}

app.use(router.routes())
   .use(router.allowedMethods())
