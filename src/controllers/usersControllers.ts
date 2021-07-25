import Koa from "koa"
import { UserModel } from "../models/userSchema"

class UsersControllers {
  async find(ctx: Koa.ParameterizedContext) {
    ctx.body = await UserModel.find()
  }
}

export default new UsersControllers()
