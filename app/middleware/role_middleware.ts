import type { NextFn } from '@adonisjs/core/types/http'
import type { HttpContext } from '@adonisjs/core/http'
import type { UserRole } from '#models/user'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, roles: UserRole[]) {
    const user = auth.getUserOrFail()
    if (!roles.includes(user.role as UserRole)) {
      return response.forbidden({
        message: 'You do not have permission to perform this action',
      })
    }
    await next()
  }
}
