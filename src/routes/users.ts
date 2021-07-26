import bcrypt from "bcryptjs"
// import { scrypt, randomBytes } from "crypto"
import jsonwebtoken from "jsonwebtoken"
// import koaJwt from "koa-jwt"
import Router from "koa-router"
import _ from "underscore"

import { Authenticate } from "../middlewares/authenticate"
import jwt from "../middlewares/jwt"
import { UserModel } from "../models/userSchema"

const router = new Router({ prefix: "/users" })

// get all users
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.get("/", jwt, async (ctx, _next) => {
  try {
    ctx.body = await UserModel.find({})
    if (!ctx.body[0]) ctx.throw(404)
  } catch (err) {
    ctx.status = err.status || 500
  }
})

// find a user by id
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.get("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await UserModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

// find by username in url
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.get("/username/:name", jwt, async (ctx, _next) => {
  try {
    const user = await UserModel.findOne({ username: ctx.params.name })
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, `username ${ctx.params.name} not found`)
    }
    ctx.throw(500)
  }
})

// find by username or email in json
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.post("/find", jwt, async (ctx, _next) => {
  const { username, email } = ctx.request.body
  let errorMessage = `user ${username} not found`
  if (!username) {
    errorMessage = `email address ${email} not found`
  }
  try {
    const user = await UserModel.findOne({ $or: [{ username }, { email }] })
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

// hash password with scrypt
// async function hash(password:string) {
//   return new Promise((resolve, reject) => {
//     const salt = randomBytes(16).toString('hex')
//     scrypt(password, salt, 64, async (err, derivedKey) => {
//       if (err) reject(err)
//       resolve(`${salt}:${derivedKey.toString('hex')}`)
//     })
//   })
// }

// hash password with bcrypt
async function hash(password: string) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (_err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  })
}

// add a user
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.post("/register", async (ctx, _next) => {
  let { username, email, password } = ctx.request.body
  // check if data is application/json
  if (!ctx.is("application/json")) {
    ctx.throw(412, "content-Type must be application/json")
  }
  try {
    // check if user exists before creating
    let user = await UserModel.findOne({ $or: [{ username }, { email }] })
    // if user doesn't exist - create user
    if (!user) {
      password = await hash(password)
      user = await new UserModel(
        _.extend(ctx.request.body, { password })
      ).save()
      ctx.status = 201
    }
    ctx.body = user
    // error handling
  } catch (err) {
    ctx.throw(422, "missing content")
  }
})

// update a user
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.put("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    )
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = await UserModel.findById(ctx.params.id)
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

// delete a user
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.delete("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await UserModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

// delete a user by username or email
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.put("/", jwt, async (ctx, _next) => {
  const { username, email } = ctx.request.body
  let errorMessage = `user ${username} not found`
  if (!username) {
    errorMessage = `email address ${email} not found`
  }
  // check if data is application/json
  if (!ctx.is("application/json")) {
    ctx.throw(412, "content-Type must be application/json")
  }
  try {
    // eslint-disable-next-line space-before-function-paren
    const user = await UserModel.findOneAndRemove({
      $or: [{ username }, { email }]
    })
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

// auth user
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.post("/login", async (ctx, _next) => {
  const { username, password } = ctx.request.body
  const secret = process.env.JWT_SECRET
  try {
    const user = await Authenticate(username, password)
    // create jwt
    ctx.status = 200
    if (secret) {
      ctx.body = {
        token: jsonwebtoken.sign({ role: "admin" }, secret, {
          expiresIn: "1d"
        }),
        message: "authentication successful",
        user: user
      }
    }
  } catch (err) {
    // user unauthorised
    ctx.throw(401, "unauthorised")
  }
})

export default router
