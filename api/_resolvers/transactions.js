import { parseResolveInfo } from 'graphql-parse-resolve-info'

const transactions = async (parent, args, { dataSources }, info) => {
  const allTransactions = await dataSources.transactionAPI.all()

  if (parseResolveInfo(info).fieldsByTypeName.Transaction.account) {
    return await Promise.all(
      allTransactions.map(async (transaction) => {
        const account = await dataSources.accountAPI.forTransaction(
          transaction.id
        )

        return {
          ...transaction,
          account,
        }
      })
    )
  }

  return allTransactions
}

export { transactions }
