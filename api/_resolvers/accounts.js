import { parseResolveInfo } from 'graphql-parse-resolve-info'

const accounts = async (parent, args, { dataSources }, info) => {
  const allAccounts = await dataSources.accountAPI.all()

  if (parseResolveInfo(info).fieldsByTypeName.Account.transactions) {
    return await Promise.all(
      allAccounts.map(async (account) => {
        const transactions = await dataSources.transactionAPI.forAccount(
          account.id
        )

        return {
          ...account,
          transactions,
        }
      })
    )
  }

  return allAccounts
}

export { accounts }
