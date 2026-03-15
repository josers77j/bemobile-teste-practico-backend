import Gateway from '#models/gateway'
import { Exception } from '@adonisjs/core/exceptions'
import Gateway1Adapter from '../adapters/gateway1_adapter.ts'
import Gateway2Adapter from '../adapters/gateway2_adapter.ts'
import type { GatewayInterface, ChargeData, ChargeResult } from '../interfaces/gateway_interface.ts'

export default class GatewayService {
  async updatePriority(id: number, priority: number) {
    const gateway = await Gateway.findOrFail(id)

    const existing = await Gateway.findBy('priority', priority)

    if (existing && existing.id !== id)
      throw new Exception(`Priority ${priority} is already assigned to another gateway`, {
        status: 409,
      })

    gateway.priority = priority
    return await gateway.save()
  }

  async toggleActiveStatus(id: number) {
    const gateway = await Gateway.findOrFail(id)
    gateway.isActive = !gateway.isActive
    return await gateway.save()
  }

  private getAdapter(name: string): GatewayInterface {
    const adapters: Record<string, GatewayInterface> = {
      Gateway1: new Gateway1Adapter(),
      Gateway2: new Gateway2Adapter(),
    }

    const adapter = adapters[name]
    if (!adapter) throw new Exception(`No adapter found for gateway: ${name}`, { status: 500 })

    return adapter
  }

  async charge(data: ChargeData): Promise<ChargeResult & { gatewayId: number }> {
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

    if (gateways.length === 0) throw new Exception('No active gateways available', { status: 422 })

    let lastError: Error | null = null

    for (const gateway of gateways) {
      try {
        const adapter = this.getAdapter(gateway.name)
        const result = await adapter.charge(data)
        return { ...result, gatewayId: gateway.id }
      } catch (error) {
        lastError = error as Error
        continue
      }
    }
    const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown error'
    throw new Exception(`All gateways failed: ${errorMessage}`, { status: 422 })
  }

  async refund(gatewayName: string, externalId: string): Promise<void> {
    const adapter = this.getAdapter(gatewayName)
    await adapter.refund(externalId)
  }
}
