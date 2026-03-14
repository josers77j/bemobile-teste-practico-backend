import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class GatewaySeeder extends BaseSeeder {
  async run() {
    await Gateway.firstOrCreate({ priority: 1 }, { name: 'Gateway1', isActive: true, priority: 1 })
    await Gateway.firstOrCreate({ priority: 2 }, { name: 'Gateway2', isActive: true, priority: 2 })
  }
}
