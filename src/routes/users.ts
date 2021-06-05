import Router from 'koa-router'
import UsersControllers from '../controllers/usersControllers'

const api = 'users'

const router = new Router()

router.prefix(`/api/${api}`)

router.get('/', UsersControllers.find)

export default router
