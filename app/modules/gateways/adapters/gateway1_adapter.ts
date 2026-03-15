import type {
  GatewayInterface,
  ChargeData,
  ChargeResult,
} from '#modules/gateways/interfaces/gateway_interface'
import env from '#start/env'

export default class Gateway1Adapter implements GatewayInterface {
  private readonly baseUrl = env.get('GATEWAY1_URL')
  private token: string | null = null

  private async authenticate(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: env.get('GATEWAY1_EMAIL'),
        token: env.get('GATEWAY1_TOKEN'),
      }),
    })

    if (!response.ok) throw new Error('Gateway1 authentication failed')

    const data = await response.json()
    this.token = data.token
  }

  async charge(data: ChargeData): Promise<ChargeResult> {
    await this.authenticate()

    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        name: data.name,
        email: data.email,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
      }),
    })

    if (!response.ok) throw new Error('Gateway1 charge failed')

    const result = await response.json()
    return {
      externalId: result.id,
      status: result.status,
    }
  }

  async refund(externalId: string): Promise<void> {
    await this.authenticate()

    const response = await fetch(`${this.baseUrl}/transactions/${externalId}/charge_back`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
    })

    if (!response.ok) throw new Error('Gateway1 refund failed')
  }
}
