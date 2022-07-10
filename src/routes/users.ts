import jsonwebtoken from "jsonwebtoken";
import Router from "koa-router";
import _ from "underscore";
import { bcryptHash } from "middlewares/hash";
import Authenticate from "middlewares/authenticate";
import jwt from "middlewares/jwt";
import { IUser, User } from "src/models/user-schema";

const router = new Router({ prefix: "/users" });

// get all users
router.get("/", jwt, async (context) => {
  try {
    context.body = await User.find({});
    if (!context.body) context.throw(404);
  } catch (error) {
    context.status = 500;
    console.error(error);
  }
});

// find a user by id
router.get("/:id", jwt, async (context) => {
  try {
    const user = await User.findById(context.params.id);
    if (!user) {
      context.throw(404);
    }
    context.body = user;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `user with the id ${context.params.id} not found`);
    }
    context.throw(500);
  }
});

// find by username in url
router.get("/username/:name", jwt, async (context) => {
  try {
    const user = await User.findOne({ username: context.params.name });
    if (!user) {
      context.throw(404);
    }
    context.body = user;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `username ${context.params.name} not found`);
    }
    context.throw(500);
  }
});

// find by username or email in json
router.post("/find", jwt, async (context) => {
  const { username, email } = context.request.body as IUser;
  let errorMessage = `user ${username} not found`;
  if (!username) {
    errorMessage = `email address ${email} not found`;
  }
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      context.throw(404, "not found");
    }
    context.body = user;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, errorMessage);
    }
    context.throw(500);
  }
});

// add a user
router.post("/register", async (context) => {
  const { username, email } = context.request.body as IUser;
  let { password } = context.request.body as IUser;
  // check if data is application/json
  if (!context.is("application/json")) {
    context.throw(412, "content-Type must be application/json");
  }
  try {
    // check if user exists before creating
    let user = await User.findOne({ $or: [{ username }, { email }] });
    // if user doesn't exist - create user
    if (!user) {
      password = await bcryptHash(password);
      user = await new User(
        _.extend(context.request.body, { password })
      ).save();
      context.status = 201;
    }
    context.body = user;
    // error handling
  } catch (error) {
    context.throw(422, "missing content");
    console.error(error);
  }
});

// update a user
router.put("/:id", jwt, async (context) => {
  try {
    const user = await User.findByIdAndUpdate(
      context.params.id,
      context.request.body as IUser
    );
    if (!user) {
      context.throw(404);
    }
    context.body = await User.findById(context.params.id);
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `user with the id ${context.params.id} not found`);
    }
    context.throw(500);
  }
});

// delete a user
router.delete("/:id", jwt, async (context) => {
  try {
    const user = await User.findByIdAndRemove(context.params.id);
    if (!user) {
      context.throw(404);
    }
    context.body = user;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, `user with the id ${context.params.id} not found`);
    }
    context.throw(500);
  }
});

// delete a user by username or email
router.put("/", jwt, async (context) => {
  const { username, email } = context.request.body as IUser;
  let errorMessage = `user ${username} not found`;
  if (!username) {
    errorMessage = `email address ${email} not found`;
  }
  // check if data is application/json
  if (!context.is("application/json")) {
    context.throw(412, "content-Type must be application/json");
  }
  try {
    const user = await User.findOneAndRemove({
      $or: [{ username }, { email }],
    });
    if (!user) {
      context.throw(404);
    }
    context.body = user;
  } catch (error) {
    if (error instanceof Error) {
      context.throw(404, errorMessage);
    }
    context.throw(500);
  }
});

// auth user
router.post("/login", async (context) => {
  const { username, password } = context.request.body as IUser;
  const secret = process.env.JWT_SECRET;
  try {
    const user = await Authenticate(username, password);
    // create jwt
    context.status = 200;
    if (secret) {
      context.body = {
        token: jsonwebtoken.sign({ role: "admin" }, secret, {
          expiresIn: "1d",
        }),
        message: "authentication successful",
        user,
      };
    }
  } catch (error) {
    // user unauthorised
    context.status = 401;
    context.body = {
      message: "unauthorised",
    };
    console.error(error);
  }
});

export default router;
