import Koa from "koa"
import { User } from "../models/userSchema"

class UsersControllers {
  async find(ctx: Koa.ParameterizedContext) {
    ctx.body = await User.find()
  }
}

export default new UsersControllers()
