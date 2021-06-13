import Router from 'koa-router'
import { arcadesModel } from '../models/arcadesSchema'
import jwt from '../middlewares/jwt'

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
router.post('/', jwt, async (ctx, next) => {
  let { index } = ctx.request.body
  // check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'content-Type must be application/json')
  }
  try {
    // check if the arcade exists before creating
    let arcade = await arcadesModel.findOne({ index })
    // if arcade doesn't exist - create arcade
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

// find by tag in json
router.post('/find', async (ctx, next) => {

  const { tags } = ctx.request.body

  let errorMessage = `${tags} not found`

  try {
    const arcade = await arcadesModel
      .findOne({ tags })

    if (!arcade) {
      ctx.throw(404)
    }

    ctx.body = arcade

  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.response.status
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

// delete an arcade
router.delete('/:id', jwt, async (ctx, next) => {
  try {
    const user = await arcadesModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

export default router
