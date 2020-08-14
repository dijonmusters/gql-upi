const webhooks = async (parent, args, { dataSources }, info) => {
  return await dataSources.webhookAPI.all()
}

const webhook = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.webhookAPI.find(id)
}

const addWebhook = async (
  parent,
  { url, description },
  { dataSources },
  info
) => {
  return await dataSources.webhookAPI.create(url, description)
}

const removeWebhook = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.webhookAPI.remove(id)
}

const pingWebhook = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.webhookAPI.ping(id)
}

export { webhooks, webhook, addWebhook, removeWebhook, pingWebhook }
