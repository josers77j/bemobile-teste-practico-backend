import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const CheckoutValidator = vine.create({
  name: vine.string().minLength(2),
  email: vine.string().email(),
  cardNumber: vine.string().regex(/^\d{16}$/),
  cvv: vine.string().regex(/^\d{3}$/),
  products: vine
    .array(
      vine.object({
        id: vine.number().positive(),
        quantity: vine.number().positive(),
      })
    )
    .minLength(1),
})
export type CheckoutDto = Infer<typeof CheckoutValidator>
