const accounts = async (parent, args, { dataSources }, info) => {
  return await dataSources.accountAPI.all()
}

const accountTransactions = async (parent, args, { dataSources }, info) => {
  return await dataSources.transactionAPI.forAccount(parent.id)
}

export { accounts, accountTransactions }
