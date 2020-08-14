import { RESTDataSource } from 'apollo-datasource-rest'
import { baseUrl } from '../_utils/request'

class CategoryAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = baseUrl
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  transform(category) {
    return {
      id: category.id,
      name: category.attributes.name,
    }
  }

  async all() {
    const response = await this.get('/categories')
    return response.data.map(this.transform)
  }

  async find(id) {
    try {
      const response = await this.get(`/categories/${id}`)
      return this.transform(response.data)
    } catch (e) {
      return null
    }
  }
}

export default CategoryAPI
