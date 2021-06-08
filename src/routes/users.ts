import Router from 'koa-router'
import _ from 'underscore'
import { userModel } from '../models/userSchema'

const router = new Router({ prefix: '/users' })

// get users
router.get('/', async (ctx, next) => {
  try {
    ctx.body = await userModel.find({})
  } catch (err) {
    ctx.status = err.status || 500
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
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
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
      ctx.throw(404, `username ${ctx.params.name} not found`)
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

// add a user
router.post('/', async (ctx, next) => {

const username = ctx.request.body.username
const email = ctx.request.body.email

// check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'content-Type must be application/json')
  }

  try {
// check if user exists before creating
    let user = await userModel
      .findOne({ $or: [{ username }, { email }] })

// if user doesn't exist - create user
    if(!user) {
      user = await new userModel(
        _.extend(ctx.request.body, { created: Date.now() })
      ).save()
      ctx.status = 201
    }

    ctx.body = user

// error handling
  } catch (err) {
    ctx.throw(422, 'missing content')
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
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

// delete a user by username or email
router.put('/', async (ctx, next) => {
  const username = ctx.request.body.username
  const email = ctx.request.body.email

  let errorMessage = `user ${username} not found`
  if (!ctx.request.body.username) {
    errorMessage = `email address ${email} not found`
  }

  // check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'content-Type must be application/json')
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
