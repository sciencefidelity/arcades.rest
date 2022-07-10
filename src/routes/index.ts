import Router from "koa-router";

const router = new Router();

router.get("/", (context) => {
  context.body = { msg: "Hello world!" };
});

export default router;
