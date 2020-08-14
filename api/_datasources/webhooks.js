import { RESTDataSource } from 'apollo-datasource-rest'
import { baseUrl } from '../_utils/request'

class WebhookAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = baseUrl
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  transform(webhook) {
    return {
      id: webhook.id,
      description: webhook.attributes.description,
      url: webhook.attributes.url,
      createdAt: webhook.attributes.createdAt,
    }
  }

  async all() {
    const response = await this.get('/webhooks')
    return response.data.map(this.transform)
  }

  async find(id) {
    try {
      const response = await this.get(`/webhooks/${id}`)
      return this.transform(response.data)
    } catch {
      return null
    }
  }

  async create(url, description) {
    const body = {
      data: {
        attributes: {
          url,
          description,
        },
      },
    }

    try {
      const response = await this.post(`/webhooks`, body)
      return await this.find(response.data.id)
    } catch (e) {
      return null
    }
  }

  async remove(id) {
    try {
      await this.delete(`/webhooks/${id}`)
      return { message: `removed webhook: ${id}` }
    } catch (e) {
      return null
    }
  }

  async ping(id) {
    try {
      await this.post(`/webhooks/${id}/ping`)
      return { message: `pinged webhook: ${id}` }
    } catch (e) {
      return null
    }
  }
}

export default WebhookAPI
