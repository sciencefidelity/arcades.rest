import Router from "koa-router"

const router = new Router()

// eslint-disable-next-line space-before-function-paren, @typescript-eslint/no-unused-vars
router.get("/", async (ctx, _next) => {
  ctx.body = { msg: "Hello world!" }
})

export default router
