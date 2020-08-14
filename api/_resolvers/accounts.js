const accounts = async (parent, args, { dataSources }, info) => {
  return await dataSources.accountAPI.all()
}

const accountTransactions = async (parent, args, { dataSources }, info) => {
  return await dataSources.transactionAPI.forAccount(parent.id)
}

const account = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.accountAPI.find(id)
}

export { accounts, accountTransactions, account }
