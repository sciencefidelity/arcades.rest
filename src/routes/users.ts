import jsonwebtoken from "jsonwebtoken"
import Router from "koa-router"
import _ from "underscore"
import { bcryptHash } from "middlewares/hash"
import Authenticate from "middlewares/authenticate"
import jwt from "middlewares/jwt"
import { User } from "models/userSchema"

const router = new Router({ prefix: "/users" })

// get all users
router.get("/", jwt, async (ctx, _next) => {
  try {
    ctx.body = await User.find({})
    if (!ctx.body[0]) ctx.throw(404)
  } catch (err) {
    ctx.status = err.status || 500
  }
})

// find a user by id
router.get("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await User.findById(ctx.params.id)
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
router.get("/username/:name", jwt, async (ctx, _next) => {
  try {
    const user = await User.findOne({ username: ctx.params.name })
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
router.post("/find", jwt, async (ctx, _next) => {
  const { username, email } = ctx.request.body
  let errorMessage = `user ${username} not found`
  if (!username) {
    errorMessage = `email address ${email} not found`
  }
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (!user) {
      ctx.throw(404, "not found")
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

// add a user
router.post("/register", async (ctx, _next) => {
  let { username, email, password } = ctx.request.body
  // check if data is application/json
  if (!ctx.is("application/json")) {
    ctx.throw(412, "content-Type must be application/json")
  }
  try {
    // check if user exists before creating
    let user = await User.findOne({ $or: [{ username }, { email }] })
    // if user doesn't exist - create user
    if (!user) {
      password = await bcryptHash(password)
      user = await new User(_.extend(ctx.request.body, { password })).save()
      ctx.status = 201
    }
    ctx.body = user
    // error handling
  } catch (err) {
    ctx.throw(422, "missing content")
  }
})

// update a user
router.put("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = await User.findById(ctx.params.id)
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, `user with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

// delete a user
router.delete("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await User.findByIdAndRemove(ctx.params.id)
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
    const user = await User.findOneAndRemove({
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
        user
      }
    }
  } catch (err) {
    // user unauthorised
    ctx.status = 401
    ctx.body = {
      message: "unauthorised"
    }
  }
})

export default router
