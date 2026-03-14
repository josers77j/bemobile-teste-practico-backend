import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { type CreateUserDto } from '../validators/create_user_validator.ts'
import { type UpdateUserDto } from '../validators/update_user_validator.ts'
import type { PaginationDto } from '#modules/shared/validators/pagination_validator'

export default class UserService {
  async index(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination
    return await User.query().paginate(page, limit)
  }

  async show(id: number) {
    return await User.findOrFail(id)
  }

  async store(data: CreateUserDto) {
    const { password, ...rest } = data

    const hashedPassword = await hash.make(password)

    return await User.create({
      ...rest,
      password: hashedPassword,
    })
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.show(id)
    const { password, ...rest } = data

    if (password) {
      return await user
        .merge({
          ...rest,
          password,
        })
        .save()
    }
    return await user.merge(rest).save()
  }

  async destroy(id: number) {
    const user = await this.show(id)
    await user.delete()
  }
}
