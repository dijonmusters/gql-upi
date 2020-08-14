const types = `
  type Account {
    id: String!
    displayName: String
    type: String
    balance: Amount
    createdAt: String
    transactions: [Transaction]
  }
`

export default types
