import { PaginationValidator } from '#modules/shared/validators/pagination_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '../services/client_service.ts'
@inject()
export default class ClientController {
  constructor(private readonly clientService: ClientService) {}

  async index({ request, response }: HttpContext) {
    const pagination = await request.validateUsing(PaginationValidator)
    const client = await this.clientService.index(pagination)
    return response.ok({ client })
  }

  async show({ params, response }: HttpContext) {
    const id = Number(params.id)
    const client = await this.clientService.show(id)
    return response.ok({ client })
  }
}
