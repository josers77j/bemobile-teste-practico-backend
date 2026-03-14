import vine from '@vinejs/vine'
import { ROLE_TYPE } from '../consts/role_type_const.ts'
import type { Infer } from '@vinejs/vine/types'

export const UpdateUserValidator = vine.create({
  name: vine.string().minLength(2).maxLength(255).optional(),
  email: vine.string().email().optional(),
  password: vine.string().minLength(8).optional(),
  role: vine.enum(ROLE_TYPE).optional(),
})

export type UpdateUserDto = Infer<typeof UpdateUserValidator>
