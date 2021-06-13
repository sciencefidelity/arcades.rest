import koaJwt from 'koa-jwt'
import config from '../config'

// initiate jwt
let secret
if (config.JWT_SECRET) {
  secret = config.JWT_SECRET
} else {
  throw new Error('secret environment variable is not set')
}

export default koaJwt({
  secret
})
