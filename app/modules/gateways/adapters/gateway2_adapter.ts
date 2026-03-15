import type {
  GatewayInterface,
  ChargeData,
  ChargeResult,
} from '#modules/gateways/interfaces/gateway_interface'
import env from '#start/env'

export default class Gateway2Adapter implements GatewayInterface {
  private readonly baseUrl = env.get('GATEWAY2_URL')
  private readonly headers = {
    'Content-Type': 'application/json',
    'Gateway-Auth-Token': env.get('GATEWAY2_AUTH_TOKEN'),
    'Gateway-Auth-Secret': env.get('GATEWAY2_AUTH_SECRET'),
  }

  async charge(data: ChargeData): Promise<ChargeResult> {
    const response = await fetch(`${this.baseUrl}/transacoes`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        valor: data.amount,
        nome: data.name,
        email: data.email,
        numeroCartao: data.cardNumber,
        cvv: data.cvv,
      }),
    })

    if (!response.ok) throw new Error('Gateway2 charge failed')

    const result = await response.json()
    return {
      externalId: result.id,
      status: result.status,
    }
  }

  async refund(externalId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ id: externalId }),
    })

    if (!response.ok) throw new Error('Gateway2 refund failed')
  }
}
