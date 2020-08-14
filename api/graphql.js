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
  webhooks,
  webhook,
  addWebhook,
  removeWebhook,
  pingWebhook,
} from './_resolvers'
import { Account, Transaction, Amount, Category, Tag, Webhook } from './_types'
import {
  TransactionAPI,
  AccountAPI,
  CategoryAPI,
  TagAPI,
  WebhookAPI,
} from './_datasources'

const typeDefs = gql`
  ${Amount}
  ${Account}
  ${Transaction}
  ${Category}
  ${Tag}
  ${Webhook}

  type Query {
    accounts: [Account]
    account(id: ID!): Account
    transactions: [Transaction]
    transaction(id: ID!): Transaction
    categories: [Category]
    category(id: ID!): Category
    tags: [Tag]
    tag(id: ID!): Tag
    webhooks: [Webhook]
    webhook(id: ID!): Webhook
  }

  type Message {
    message: String
  }

  type Mutation {
    addTagsToTransaction(transactionId: ID!, tags: [String]!): Transaction
    removeTagsFromTransaction(transactionId: ID!, tags: [String]!): Transaction
    addWebhook(url: String, description: String!): Webhook
    removeWebhook(id: ID!): Message
    pingWebhook(id: ID!): Message
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
    webhooks,
    webhook,
  },
  Mutation: {
    addTagsToTransaction,
    removeTagsFromTransaction,
    addWebhook,
    removeWebhook,
    pingWebhook,
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
  webhookAPI: new WebhookAPI(),
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
