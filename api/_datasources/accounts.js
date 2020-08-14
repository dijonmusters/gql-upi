import { RESTDataSource } from 'apollo-datasource-rest'
import { baseUrl } from '../_utils/request'

class AccountAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = baseUrl
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  transform(account) {
    return {
      id: account.id,
      type: account.attributes.accountType,
      displayName: account.attributes.displayName,
      balance: {
        currencyCode: account.attributes.balance.currencyCode,
        value: account.attributes.balance.value,
        valueInBaseUnits: account.attributes.balance.valueInBaseUnits,
      },
      createdAt: account.attributes.createdAt,
    }
  }

  async all() {
    const response = await this.get('/accounts')
    return response.data.map(this.transform)
  }

  async find(id) {
    try {
      const response = await this.get(`/accounts/${id}`)
      return this.transform(response.data)
    } catch (e) {
      return null
    }
  }

  async forTransaction(id) {
    const response = await this.get(`/transactions/${id}`)
    const accountId = response.data.relationships.account.data.id
    return this.find(accountId)
  }
}

export default AccountAPI
