export interface GatewayInterface {
  charge(data: ChargeData): Promise<ChargeResult>
  refund(externalId: string): Promise<void>
}

export type ChargeData = {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export type ChargeResult = {
  externalId: string
  status: string
}
