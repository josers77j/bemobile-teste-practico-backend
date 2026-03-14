import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const CreateProductValidator = vine.create({
  name: vine.string().minLength(2).maxLength(255),
  amount: vine.number().positive(),
})
export type CreateProductDto = Infer<typeof CreateProductValidator>
