import Router from 'koa-router'
// import { scrypt, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import _ from 'underscore'
import { userModel } from '../models/userSchema'
import { Authenticate } from '../auth/auth'

const router = new Router({ prefix: '/users' })

// get all users
router.get('/', async (ctx, next) => {
  try {
    ctx.body = await userModel.find({})
    if (!ctx.body[0]) ctx.throw(204)
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
      ctx.throw(404, `username ${ctx.params.name} not found`)
    }
    ctx.throw(500)
  }
})

// find by username or email in json
router.post('/find', async (ctx, next) => {

  const { username, email } = ctx.request.body

  let errorMessage = `user ${username} not found`
  if (!username) {
    errorMessage = `email address ${email} not found`
  }

  try {
    const user = await userModel
      .findOne({ $or: [
        { username },
        { email }
      ]})

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

  let { username, email, password } = ctx.request.body

  // check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'content-Type must be application/json')
  }

  try {
    // check if user exists before creating
    let user = await userModel.findOne({ $or: [
      { username },
      { email }
    ]})

    // if user doesn't exist - create user
    if(!user) {

      // hash password (scrypt)
      // async function hash(password:string) {
      //   return new Promise((resolve, reject) => {
      //     const salt = randomBytes(16).toString('hex')
      //     scrypt(password, salt, 64, async (err, derivedKey) => {
      //       if (err) reject(err)
      //       resolve(`${salt}:${derivedKey.toString('hex')}`)
      //     })
      //   })
      // }

      // hash password (bcrypt)
      async function hash(password:string) {
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) reject(err)
              resolve(hash)
            })
          })
        })
      }

      password = await hash(password)
      user = await new userModel(
        _.extend(ctx.request.body, { password })).save()
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
    ctx.body = await userModel.findById(ctx.params.id)
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'NotFoundError') {
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
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

  const { username, email } = ctx.request.body

  let errorMessage = `user ${username} not found`
  if (!username) {
    errorMessage = `email address ${email} not found`
  }

  // check if data is application/json
  if(!ctx.is('application/json')) {
    ctx.throw(412, 'content-Type must be application/json')
  }

  try {
    const user = await userModel.findOneAndRemove({ $or: [
      { username },
      { email }
    ]})

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

// auth user
router.post('/auth', async (ctx, next) => {
  const { username, password } = ctx.request.body
  try {
    const user = await Authenticate(username, password)
    if (user) ctx.body.user
  } catch(err) {
    // user unauthorised
    ctx.throw(500, 'unauthorised')
  }

})

export default router
