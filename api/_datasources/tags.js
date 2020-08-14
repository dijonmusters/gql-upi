import { RESTDataSource } from 'apollo-datasource-rest'
import { baseUrl } from '../_utils/request'

class TagAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = baseUrl
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  transform(tag) {
    return {
      id: tag.id,
    }
  }

  async all() {
    const response = await this.get('/tags')
    return response.data.map(this.transform)
  }

  async forTransaction(id) {
    try {
      const response = await this.get(`/transactions/${id}`)
      return response.data.relationships.tags.data.map(this.transform)
    } catch (e) {
      return null
    }
  }

  async find(id) {
    try {
      const response = await this.get(`/tags`)
      return response.data.find((tag) => tag.id === id) ? { id } : null
    } catch (e) {
      return null
    }
  }
}

export default TagAPI
