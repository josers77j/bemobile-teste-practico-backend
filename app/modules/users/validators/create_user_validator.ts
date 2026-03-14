import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { ROLE_TYPE } from '../consts/role_type_const.ts'

export const CreateUserValidator = vine.create({
  name: vine.string().minLength(2).maxLength(255),
  email: vine.string().email(),
  password: vine.string().minLength(8),
  role: vine.enum(ROLE_TYPE),
})

export type CreateUserDto = Infer<typeof CreateUserValidator>
