import Router from "koa-router";
import { Arcade, IArcade } from "models/arcades-schema";
import jwt from "middlewares/jwt";

const router = new Router({ prefix: "/arcades" });

// get all arcades
router.get("/", async (context) => {
  const { id } = context.params;
  try {
    context.body = await Arcade.find({});
    if (!context.body) context.throw(404);
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `arcade with the id ${id} not found`);
    }
    context.throw(500);
  }
});

// arcade by id
router.post("/:id", async (context) => {
  const { id } = context.params;
  try {
    const arcade = await Arcade.findOne({ id });
    if (!arcade) {
      context.throw(404);
    }
    context.body = arcade;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `arcade with the id ${id} not found`);
    }
    context.throw(500);
  }
});

// add an arcade
router.post("/", jwt, async (context) => {
  const { index } = context.request.body as IArcade;
  // check if data is application/json
  if (!context.is("application/json")) {
    context.throw(412, "content-Type must be application/json");
  }
  try {
    // check if the arcade exists before creating
    let arcade = await Arcade.findOne({ index });
    // if arcade doesn't exist - create arcade
    if (!arcade) {
      arcade = await new Arcade(context.request.body).save();
      context.status = 201;
    }
    context.body = arcade;
    // error handling
  } catch (error) {
    context.throw(422, "missing content");
    console.error(error);
  }
});

// find by tag in json
router.post("/find", async (context) => {
  const { tag } = context.request.body as { tag: string };
  const errorMessage = `${tag} not found`;
  try {
    const arcade = await Arcade.findOne({ tag });
    if (!arcade) {
      context.throw(404);
    }
    context.body = arcade;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, errorMessage);
    }
    context.throw(500);
  }
});

// delete an arcade
router.delete("/:id", jwt, async (context) => {
  const { id } = context.params;
  try {
    const user = await Arcade.findByIdAndRemove(id);
    if (!user) {
      context.throw(404);
    }
    context.body = user;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `arcade with the id ${id} not found`);
    }
    context.throw(500);
  }
});

export default router;
