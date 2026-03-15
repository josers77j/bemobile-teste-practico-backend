import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import GatewayService from '../services/gateway_service.ts'
@inject()
export default class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
  async updatePriority({ params, request, response }: HttpContext) {
    const id = Number(params.id)
    const priority = Number(request.input('priority'))
    if (!priority || Number.isNaN(Number(priority)) || Number(priority) < 1) {
      return response.unprocessableEntity({ message: 'Priority must be a positive number' })
    }
    const gateway = await this.gatewayService.updatePriority(id, priority)
    return response.ok({ gateway })
  }

  async toggleActiveStatus({ params, response }: HttpContext) {
    const id = Number(params.id)

    const gateway = await this.gatewayService.toggleActiveStatus(id)
    return response.ok({ gateway })
  }
}
