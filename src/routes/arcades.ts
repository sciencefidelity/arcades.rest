import Router from "koa-router"

import { ArcadesModel } from "../models/arcadesSchema"
import jwt from "../middlewares/jwt"

const router = new Router({ prefix: "/arcades" })

// get all arcades
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.get("/", async (ctx, _next) => {
  try {
    ctx.body = await ArcadesModel.find({})
    if (!ctx.body[0]) ctx.throw(404)
  } catch (err) {
    ctx.status = err.status || 500
  }
})

// add an arcade
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.post("/", jwt, async (ctx, _next) => {
  const { index } = ctx.request.body
  // check if data is application/json
  if (!ctx.is("application/json")) {
    ctx.throw(412, "content-Type must be application/json")
  }
  try {
    // check if the arcade exists before creating
    let arcade = await ArcadesModel.findOne({ index })
    // if arcade doesn't exist - create arcade
    if (!arcade) {
      arcade = await new ArcadesModel(ctx.request.body).save()
      ctx.status = 201
    }
    ctx.body = arcade
    // error handling
  } catch (err) {
    ctx.throw(422, "missing content")
  }
})

// find by tag in json
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.post("/find", async (ctx, _next) => {
  const { tags } = ctx.request.body
  const errorMessage = `${tags} not found`
  try {
    const arcade = await ArcadesModel.findOne({ tags })
    if (!arcade) {
      ctx.throw(404)
    }
    ctx.body = arcade
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, errorMessage)
    }
    ctx.throw(500)
  }
})

// delete an arcade
// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.delete("/:id", jwt, async (ctx, _next) => {
  try {
    const user = await ArcadesModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  } catch (err) {
    if (err.name === "CastError" || err.name === "NotFoundError") {
      ctx.throw(404, `arcade with the id ${ctx.params.id} not found`)
    }
    ctx.throw(500)
  }
})

export default router
