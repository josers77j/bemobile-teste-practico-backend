import User from '#models/user'

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ROLE_TYPE } from '../../app/modules/users/consts/role_type_const.ts'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'admin@bemobile.com' },
      {
        name: 'Admin',
        email: 'admin@bemobile.com',
        password: 'AdminBeMobile1234!', //NOSONAR
        role: ROLE_TYPE.ADMIN,
      }
    )
  }
}
