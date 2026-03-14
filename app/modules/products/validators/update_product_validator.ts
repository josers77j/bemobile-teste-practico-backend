import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const UpdateProductValidator = vine.create({
  name: vine.string().minLength(2).maxLength(255).optional(),
  amount: vine.number().positive().optional(),
})

export type UpdateProductDto = Infer<typeof UpdateProductValidator>
