import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const PaginationValidator = vine.create({
  page: vine.number().min(1).optional(),
  limit: vine.number().min(1).max(100).optional(),
})

export type PaginationDto = Infer<typeof PaginationValidator>
