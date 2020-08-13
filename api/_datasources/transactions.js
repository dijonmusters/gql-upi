import { RESTDataSource } from 'apollo-datasource-rest'
import { baseUrl } from '../_utils/request'

class TransactionAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = baseUrl
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  transform(transaction) {
    return {
      id: transaction.id,
      status: transaction.attributes.status,
      description: transaction.attributes.description,
      amount: {
        currencyCode: transaction.attributes.amount.currencyCode,
        value: transaction.attributes.amount.value,
        valueInBaseUnits: transaction.attributes.amount.valueInBaseUnits,
      },
      createdAt: transaction.attributes.createdAt,
    }
  }

  async all() {
    const response = await this.get('/transactions')
    return response.data.map(this.transform)
  }

  async find(id) {
    const response = await this.get(`/transactions/${id}`)
    return this.transform(response.data)
  }

  async forAccount(id) {
    const response = await this.get(`/accounts/${id}/transactions`)
    return response.data.map(this.transform)
  }
}

export default TransactionAPI
