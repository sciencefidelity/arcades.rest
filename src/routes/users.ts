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
      ctx.throw(404, `there is no user with the id ${ctx.params.id}`)
    }
    ctx.throw(500)
  }
})

// find by username in url, only show username
router.get('/username/:name', async (ctx, next) => {
  try {
    const user = await userModel.find({ username: ctx.params.name }, 'username')
    if (!user) {
      ctx.throw(404, `username ${ctx.params.name} not found`)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// find by username or email in json
router.post('/find', async (ctx, next) => {

  const username = ctx.request.body.username
  const email = ctx.request.body.email

  let errorMessage = `user ${username} not found`
  if (!ctx.request.body.username) {
    errorMessage = `email address ${email} not found`
  }

  try {
    const user = await userModel
      .findOne({ $or: [{ username }, { email }] })

    if (!user) {
      ctx.throw(404)
    }

    ctx.body = user

  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.response.status
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

//***** add user *****

router.post('/', async (ctx, next) => {

const username = ctx.request.body.username
const email = ctx.request.body.email
const avatar = ctx.request.body.avatar

// check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'Content-Type must be application/json')
  }

  try {
// check if user exists before creating
    let user = await userModel
      .findOne({ $or: [{ username }, { email }] })

// if user doesn't exist - create user
    if(!user) {
      user = await new userModel({
        username, email, avatar,
        created: Date.now()
      }).save()
      ctx.status = 201
    }

    ctx.body = user

// error handling
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

// delete a user by username or email
router.delete('/', async (ctx, next) => {
  const username = ctx.request.body.username
  const email = ctx.request.body.email

  let errorMessage = `user ${username} not found`
  if (!ctx.request.body.username) {
    errorMessage = `email address ${email} not found`
  }

  try {
    const user = await userModel
      .findOneAndRemove({ $or: [{ username }, { email }] })

    if (!user) {
      ctx.throw(404)
    }

    ctx.body = user
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

export default router
