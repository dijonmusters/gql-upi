import { ApolloServer, gql } from 'apollo-server-micro'
import {
  accounts,
  account,
  transactions,
  transaction,
  accountTransactions,
  transactionAccount,
  categories,
  category,
} from './_resolvers'
import { Account, Transaction, Amount, Category } from './_types'
import { TransactionAPI, AccountAPI, CategoryAPI } from './_datasources'

const typeDefs = gql`
  ${Amount}
  ${Account}
  ${Transaction}
  ${Category}

  type Query {
    accounts: [Account]
    account(id: ID!): Account
    transactions: [Transaction]
    transaction(id: ID!): Transaction
    categories: [Category]
    category(id: ID!): Category
  }
`

const resolvers = {
  Query: {
    accounts,
    account,
    transactions,
    transaction,
    categories,
    category,
  },
  Account: {
    transactions: accountTransactions,
  },
  Transaction: {
    account: transactionAccount,
  },
}

const dataSources = () => ({
  transactionAPI: new TransactionAPI(),
  accountAPI: new AccountAPI(),
  categoryAPI: new CategoryAPI(),
})

const isAuthenticated = ({ req }) => {
  const token = req.headers.authorization
  if (!token)
    throw new Error(
      'You must provide a personal access token: https://api.up.com.au/getting_started'
    )
  return { token }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: isAuthenticated,
})

const handler = server.createHandler()

export default handler
