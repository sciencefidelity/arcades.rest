import User from '../models/userSchema'

class UsersControllers {
  async find(ctx:any) {
    ctx.body = await User.find()
  }

}

export default new UsersControllers()
