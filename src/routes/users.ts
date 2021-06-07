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
      ctx.throw(404)
    }
    ctx.throw(500)
  }
})

// find by username in url, only show username
router.get('/username/:name', async (ctx, next) => {
  try {
    const user = await userModel.find({ username: ctx.params.name }, 'username')
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

// find by username or email in json
router.post('/find', async (ctx, next) => {
  try {
    const user = await userModel.findOne({ $or: [{ username: ctx.request.body.username }, { email: ctx.request.body.email }] })
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

//***** add user *****

router.post('/', async (ctx, next) => {

const username = ctx.request.body.username
const email = ctx.request.body.email
const avatar = ctx.request.body.avatar

// check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(422)
    ctx.body = 'Expects \'application/json\''
    console.log('Expects \'application/json\'')
  }

  try {
// check if user exists before creating
    const user = await userModel
      .findOne({ $or: [{ username }, { email }] })

    if(user) {
      console.log('User already exists.')
    }

// if user doesn't exist - create user
    if(!user) {
      new userModel({
        username, email, avatar,
        created: Date.now()
      }).save()
      console.log('User created.')
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

export default router
