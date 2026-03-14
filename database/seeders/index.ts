import { BaseSeeder } from '@adonisjs/lucid/seeders'
import GatewaySeeder from './gateway_seeder.js'
import UserSeeder from './user_seeder.js'
import ProductSeeder from './product_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    await new GatewaySeeder(this.client).run()
    await new UserSeeder(this.client).run()
    await new ProductSeeder(this.client).run()
  }
}
