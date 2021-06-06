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

// add user
router.post('/', async (ctx, next) => {
  try {
    const user = new userModel({
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      avatar: ctx.request.body.avatar,
      created: Date.now()
    }).save()
    ctx.body = user
  } catch (err) {
    ctx.throw(422);
  }
})

export default router
