const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

const { getUser } = require('../../config/get-user')

const verifyCallback = async (req, payload, done) => {
  try {
    const user = await getUser(payload)
    req.tokenPayload = payload
    done(null, user)
  } catch (error) {
    done(error)
  }
}

const strategy = new Strategy(
  {
    passReqToCallback: true,
    algorithm: 'RS256',
    secretOrKey: '',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  },
  verifyCallback
)

module.exports.authMiddleware = () => {
  return passport.authenticate(strategy, {
    session: false,
    failWithError: true
  })
}
