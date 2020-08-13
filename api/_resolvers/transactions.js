import axios from 'axios'
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

const transactions = async (parent, args, context, info) => {
  const { token } = context
  const { data } = await axios.get(`${baseUrl}/transactions`, getOptions(token))
  const transactions = transformTransactions(data.data)
  return transactions
}

export { transactions }
