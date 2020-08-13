const baseUrl = 'https://api.up.com.au/api/v1'

const getOptions = token => ({
  headers: {
    Authorization: token
  }
})

export {
  baseUrl,
  getOptions
}
