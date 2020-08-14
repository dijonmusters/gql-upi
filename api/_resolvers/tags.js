const tags = async (parent, args, { dataSources }, info) => {
  return await dataSources.tagAPI.all()
}

const tagTransactions = async (parent, args, { dataSources }, info) => {
  return await dataSources.transactionAPI.forTag(parent.id)
}

const tag = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.tagAPI.find(id)
}

const addTagsToTransaction = async (
  parent,
  { transactionId, tags },
  { dataSources },
  info
) => {
  return await dataSources.transactionAPI.addTags(transactionId, tags)
}

const removeTagsFromTransaction = async (
  parent,
  { transactionId, tags },
  { dataSources },
  info
) => {
  return await dataSources.transactionAPI.removeTags(transactionId, tags)
}

export {
  tags,
  tag,
  tagTransactions,
  addTagsToTransaction,
  removeTagsFromTransaction,
}
