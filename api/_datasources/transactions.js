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
    try {
      const response = await this.get(`/transactions/${id}`)
      return this.transform(response.data)
    } catch {
      return null
    }
  }

  async forAccount(id) {
    const response = await this.get(`/accounts/${id}/transactions`)
    return response.data.map(this.transform)
  }

  async forTag(id) {
    const response = await this.get(`/transactions?filter[tag]=${id}`)
    return response.data.map(this.transform)
  }

  async addTags(id, tags) {
    const body = {
      data: tags.map((tag) => ({
        type: 'tags',
        id: tag,
      })),
    }

    try {
      await this.post(`/transactions/${id}/relationships/tags`, body)
      return await this.find(id)
    } catch (e) {
      return null
    }
  }

  async removeTags(id, tags) {
    // TODO: Fix this endpoint - returning 422 unprocessable entity
    const body = {
      data: tags.map((tag) => ({
        type: 'tags',
        id: tag,
      })),
    }

    try {
      await this.delete(`/transactions/${id}/relationships/tags`, body)
      return await this.find(id)
    } catch (e) {
      return null
    }
  }
}

export default TransactionAPI
