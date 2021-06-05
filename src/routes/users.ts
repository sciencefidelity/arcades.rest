import Router from 'koa-router'
import UsersControllers from '../controllers/users'

const router = new Router()

router.prefix(`/api/${api}`)

router.get('/', UsersControllers.find)

export default router
