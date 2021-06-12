import Router from 'koa-router'
import { arcadesModel } from '../models/arcadesSchema'

const router = new Router({ prefix: '/arcades' })

// get all arcades
router.get('/', async (ctx, next) => {
  try {
    ctx.body = await arcadesModel.find({})
    if (!ctx.body[0]) ctx.throw(404)
  } catch (err) {
    ctx.status = err.status || 500
  }
})

// add an arcade
router.post('/', async (ctx, next) => {
  let { index } = ctx.request.body
  // check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'content-Type must be application/json')
  }
  try {
    // check if the arcade exists before creating
    let arcade = await arcadesModel.findOne({ index })
    // if user doesn't exist - create arcade
    if(!arcade) {
      arcade = await new arcadesModel(ctx.request.body).save()
      ctx.status = 201
    }
    ctx.body = arcade
  // error handling
  } catch (err) {
    ctx.throw(422, 'missing content')
  }
})

export default router
