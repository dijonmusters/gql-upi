const transactions = async (parent, args, { dataSources }, info) => {
  return await dataSources.transactionAPI.all()
}

const transactionAccount = async (parent, args, { dataSources }, info) => {
  return await dataSources.accountAPI.forTransaction(parent.id)
}

export { transactions, transactionAccount }
