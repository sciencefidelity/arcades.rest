import Router from "koa-router"

const router = new Router()

router.get("/", async (ctx, _next) => {
	ctx.body = { msg: "Hello world!" }
})

export default router
