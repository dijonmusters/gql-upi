import { ApolloServer, gql } from 'apollo-server-micro'
import { accounts, transactions } from './_resolvers'
import { Account, Transaction, Amount } from './_types'
import { TransactionAPI, AccountAPI } from './_datasources'

const typeDefs = gql`
  ${Amount}
  ${Account}
  ${Transaction}

  type Query {
    accounts: [Account]
    transactions: [Transaction]
  }
`

const resolvers = {
  Query: {
    accounts,
    transactions,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    transactionAPI: new TransactionAPI(),
    accountAPI: new AccountAPI(),
  }),
  context: ({ req }) => {
    const token = req.headers.authorization
    if (!token)
      throw new Error(
        'You must provide a personal access token: https://api.up.com.au/getting_started'
      )
    return { token }
  },
})

const handler = server.createHandler()

export default handler
