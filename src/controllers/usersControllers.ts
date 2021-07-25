import Koa from "koa"
import { userModel } from "../models/userSchema"

class UsersControllers {
  async find(ctx: Koa.ParameterizedContext) {
    ctx.body = await userModel.find()
  }
}

export default new UsersControllers()
