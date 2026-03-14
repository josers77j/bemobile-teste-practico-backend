import type { HttpContext } from '@adonisjs/core/http'
import { PaginationValidator } from '../../shared/validators/pagination_validator.ts'

import { inject } from '@adonisjs/core'
import UserService from '../services/user_service.ts'
import { CreateUserValidator } from '../validators/create_user_validator.ts'
import { UpdateUserValidator } from '../validators/update_user_validator.ts'

@inject()
export default class UserController {
  constructor(private readonly userService: UserService) {}
  async index({ request, response }: HttpContext) {
    const pagination = await request.validateUsing(PaginationValidator)
    const user = await this.userService.index(pagination)
    return response.ok(user)
  }

  async show({ params, response }: HttpContext) {
    const id = Number(params.id)
    const user = await this.userService.show(id)
    return response.ok({ user })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateUserValidator)

    const user = await this.userService.store(data)

    return response.created({ user })
  }

  async update({ params, request, response }: HttpContext) {
    const id = Number(params.id)
    const data = await request.validateUsing(UpdateUserValidator)

    const user = await this.userService.update(id, data)

    return response.ok({ user })
  }

  async destroy({ params, response }: HttpContext) {
    const id = Number(params.id)
    await this.userService.destroy(id)

    return response.noContent()
  }
}
