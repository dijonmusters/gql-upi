import { ApolloServer, gql } from 'apollo-server-micro'
import {
  accounts,
  account,
  transactions,
  transaction,
  accountTransactions,
  transactionTags,
  transactionAccount,
  categories,
  category,
  tags,
  tag,
  tagTransactions,
  addTagsToTransaction,
  removeTagsFromTransaction,
} from './_resolvers'
import { Account, Transaction, Amount, Category, Tag } from './_types'
import { TransactionAPI, AccountAPI, CategoryAPI, TagAPI } from './_datasources'

const typeDefs = gql`
  ${Amount}
  ${Account}
  ${Transaction}
  ${Category}
  ${Tag}

  type Query {
    accounts: [Account]
    account(id: ID!): Account
    transactions: [Transaction]
    transaction(id: ID!): Transaction
    categories: [Category]
    category(id: ID!): Category
    tags: [Tag]
    tag(id: ID!): Tag
  }

  type Mutation {
    addTagsToTransaction(transactionId: ID!, tags: [String]!): Transaction
    removeTagsFromTransaction(transactionId: ID!, tags: [String]!): Transaction
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
    tags,
    tag,
  },
  Mutation: {
    addTagsToTransaction,
    removeTagsFromTransaction,
  },
  Account: {
    transactions: accountTransactions,
  },
  Transaction: {
    account: transactionAccount,
    tags: transactionTags,
  },
  Tag: {
    transactions: tagTransactions,
  },
}

const dataSources = () => ({
  transactionAPI: new TransactionAPI(),
  accountAPI: new AccountAPI(),
  categoryAPI: new CategoryAPI(),
  tagAPI: new TagAPI(),
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
