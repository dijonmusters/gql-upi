import { ApolloServer, gql } from 'apollo-server-micro'
import {
  accounts,
  account,
  transactions,
  transaction,
  accountTransactions,
  transactionAccount,
} from './_resolvers'
import { Account, Transaction, Amount } from './_types'
import { TransactionAPI, AccountAPI } from './_datasources'

const typeDefs = gql`
  ${Amount}
  ${Account}
  ${Transaction}

  type Query {
    accounts: [Account]
    account(id: ID!): Account
    transactions: [Transaction]
    transaction(id: ID!): Transaction
  }
`

const resolvers = {
  Query: {
    accounts,
    account,
    transactions,
    transaction,
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
