import vine from '@vinejs/vine'

export const CreateProductValidator = vine.object({
  name: vine.string().minLength(2).maxLength(255),
  amount: vine.number().positive(),
})

export const UpdateProductValidator = vine.object({
  name: vine.string().minLength(2).maxLength(255).optional(),
  amount: vine.number().positive().optional(),
})
