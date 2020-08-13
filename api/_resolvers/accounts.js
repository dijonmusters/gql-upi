import axios from 'axios'
import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { baseUrl, getOptions } from '../_utils/request'

const transformTransactions = (transactions) =>
  transactions.map((transaction) => ({
    id: transaction.id,
    status: transaction.attributes.status,
    description: transaction.attributes.description,
    amount: {
      currencyCode: transaction.attributes.amount.currencyCode,
      value: transaction.attributes.amount.value,
      valueInBaseUnits: transaction.attributes.amount.valueInBaseUnits,
    },
    createdAt: transaction.attributes.createdAt,
  }))

const transformAccounts = (accounts) =>
  accounts.map((account) => ({
    id: account.id,
    type: account.attributes.accountType,
    displayName: account.attributes.displayName,
    balance: {
      currencyCode: account.attributes.balance.currencyCode,
      value: account.attributes.balance.value,
      valueInBaseUnits: account.attributes.balance.valueInBaseUnits,
    },
    createdAt: account.attributes.createdAt,
  }))

const accounts = async (parent, args, context, info) => {
  const { token } = context
  const { data } = await axios.get(`${baseUrl}/accounts`, getOptions(token))
  const accounts = transformAccounts(data.data)
  if (parseResolveInfo(info).fieldsByTypeName.Account.transactions) {
    return await Promise.all(
      accounts.map(async (account) => {
        const { data } = await axios.get(
          `${baseUrl}/accounts/${account.id}/transactions`,
          getOptions(token)
        )

        const transactions = transformTransactions(data.data)
        return {
          ...account,
          transactions,
        }
      })
    )
  }
  return accounts
}

export { accounts }
