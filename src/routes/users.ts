import Router from 'koa-router'
import { userModel } from '../models/userSchema'

const router = new Router({ prefix: '/users' })

// get users
router.get('/', async (ctx, next) => {
  try {
    ctx.body = await userModel.find({})
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})
;
// find a user by id
router.get('/:id', async (ctx, next) => {
  try {
    const user = await userModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// find by username in url
router.get('/username/:name', async (ctx, next) => {
  try {
    const user = await userModel.findOne({ username: ctx.params.name })
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// add user
router.post('/', async (ctx, next) => {
  if(!ctx.is('application/json')) {
    ctx.throw(422)
    ctx.body = 'Expects \'application/json\''
  }
  try {
    const user = new userModel({
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      avatar: ctx.request.body.avatar,
      created: Date.now()
    }).save()
    ctx.body = user
  } catch (err) {
    ctx.throw(422)
  }
})

// update a user
router.put('/:id', async (ctx, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    )
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// delete a user
router.delete('/:id', async (ctx, next) => {
  try {
    const user = await userModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

export default router
