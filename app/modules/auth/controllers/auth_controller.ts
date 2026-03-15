import type { HttpContext } from '@adonisjs/core/http'
import { LoginValidator } from '../validators/auth_validators.ts'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(LoginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token.value?.release(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.noContent()
  }
}
