import Router from 'koa-router'
import * as arcades from '../data/example.json'

const router = new Router({ prefix: '/arcades' })

router.get('/', async (ctx, next) => {
  ctx.body = arcades
})

export default router
