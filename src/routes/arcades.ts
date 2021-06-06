import Router from 'koa-router'

import * as arcades from '../data/example.json'

const router = new Router()

const sendArcades = (ctx:any, next:any) => {
  ctx.body = arcades
}

router.get('/arcades', sendArcades)

export default arcades
