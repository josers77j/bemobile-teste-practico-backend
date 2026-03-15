import vine from '@vinejs/vine'

export const LoginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string().minLength(8),
})
