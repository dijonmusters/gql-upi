const transactions = async (parent, args, { dataSources }, info) => {
  return await dataSources.transactionAPI.all()
}

const transactionAccount = async (parent, args, { dataSources }, info) => {
  return await dataSources.accountAPI.forTransaction(parent.id)
}

const transactionTags = async (parent, args, { dataSources }, info) => {
  return await dataSources.tagAPI.forTransaction(parent.id)
}

const transaction = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.transactionAPI.find(id)
}

export { transactions, transactionAccount, transactionTags, transaction }
